import { google } from "googleapis";
import axios from "axios";
import pg from "pg";
const { Client } = pg;
import fs, { access } from "fs";
import path from "path";
import os from "os";
import FormData from "form-data";
import OAuth from "oauth-1.0a";
import crypto from "crypto";

async function updateDatabase(uploadRequestId, status, platform) {
  const client = new Client({
    user: process.env.RDS_USER_NAME,
    host: process.env.RDS_HOST,
    database: process.env.RDS_DB_NAME,
    password: process.env.RDS_DB_PASS,
    port: process.env.RDS_DB_PORT,
    ssl: {
      ca: fs.readFileSync(process.env.RDS_SSL_CERT).toString(),
    },
  });

  await client.connect();
  // Step 1: Update the upload_type_mapping JSON field
  const query = `
  UPDATE UPLOAD_REQUEST
  SET upload_type_mapping = (
    SELECT jsonb_agg(
      CASE
        WHEN elem->>'platform' = '${platform}'
        THEN jsonb_set(elem, '{status}', '"${status}"', false)
        ELSE elem
      END
    )
    FROM jsonb_array_elements(upload_type_mapping::jsonb) AS elem
  )
  WHERE upload_request_id = $1;
`;
  await client.query(query, [uploadRequestId]);

  // Step 2: Check the overall status of all mappings
  const checkStatusQuery = `
    SELECT upload_type_mapping::jsonb FROM UPLOAD_REQUEST WHERE upload_request_id = $1;
  `;
  const result = await client.query(checkStatusQuery, [uploadRequestId]);

  if (result.rows.length > 0) {
    const uploadTypeMapping = result.rows[0].upload_type_mapping;
    const statuses = uploadTypeMapping.map((item) => item.status);
    let finalStatus = 4;

    if (statuses.every((s) => s === "5")) {
      finalStatus = 5;
    } else if (statuses.includes("6")) {
      finalStatus = 6;
    }

    // Step 3: Update upload_request_status accordingly
    const updateRequestStatusQuery = `
    UPDATE UPLOAD_REQUEST SET upload_request_status = $1 WHERE upload_request_id = $2;
    `;
    await client.query(updateRequestStatusQuery, [
      finalStatus,
      uploadRequestId,
    ]);
  }
  await client.end();
}

async function downloadFromCloudFront(fileUrl, downloadPath) {
  const response = await axios({
    method: "GET",
    url: fileUrl,
    responseType: "stream",
  });

  const writer = fs.createWriteStream(downloadPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

export async function handler(event) {
  // return event;
  console.log("event", event);
  const message = JSON.parse(event.Records[0].body);
  const {
    accessToken,
    fileUrl,
    title,
    description,
    tags,
    uploadRequestId,
    platform,
  } = message;

  // Define the path for the temporary file
  console.log("data extracted...");
  const tempFilePath = path.join(os.tmpdir(), "video.mp4");

  try {
    console.log("downloading file from cloudfront...");
    await downloadFromCloudFront(fileUrl, tempFilePath);
    switch (platform) {
      case "YOUTUBE":
        await youtubeUploadHandler(
          accessToken,
          title,
          description,
          tags,
          tempFilePath,
          uploadRequestId,
          platform
        );
        break;
      case "TWITTER":
        await twitterUploadHandler(
          accessToken,
          title,
          description,
          tags,
          tempFilePath,
          uploadRequestId,
          platform
        );
        break;
      default:
        return { statusCode: 400, body: "Invalid platform" };
    }
  } catch (error) {
    console.error("Upload failed:", error);
    await updateDatabase(event.uploadRequestId, 6);
    return { statusCode: 500, body: "Upload failed" };
  } finally {
    // Clean up temporary file
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (cleanupError) {
      console.error("Error during temporary file cleanup:", cleanupError);
    }
  }
}

async function youtubeUploadHandler(
  accessToken,
  title,
  description,
  tags,
  tempFilePath,
  uploadRequestId,
  platform
) {
  try {
    // Authenticate YouTube API
    console.log("authenticating youtube...");
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    console.log("uploading video...");
    const videoResponse = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: title,
          description: description,
          tags: tags,
          categoryId: "22",
          selfDeclaredMadeForKids: true,
        },
        status: { privacyStatus: "public" },
      },
      media: { body: fs.createReadStream(tempFilePath) },
    });

    // Get video ID
    const videoId = videoResponse.data.id;
    console.log("Upload successful, Video ID:", videoId);

    // Update database
    await updateDatabase(uploadRequestId, 5, platform);
    return { statusCode: 200, body: "Upload successful" };
  } catch (error) {
    console.error("Upload failed:", error);
    await updateDatabase(uploadRequestId, 6, platform);
    return { statusCode: 500, body: "Upload failed" };
  } finally {
    // Clean up temporary file
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (cleanupError) {
      console.error("Error during temporary file cleanup:", cleanupError);
    }
  }
}

async function twitterUploadHandler(
  accessToken,
  title,
  description,
  tags,
  tempFilePath,
  uploadRequestId,
  platform
) {
  try {
    const fileSize = fs.statSync(tempFilePath).size;
    console.log("step 1");
    const mediaId = await twitterInitUpload(
      tempFilePath,
      accessToken,
      fileSize
    );
    const chunkSize = 3 * 1024 * 1024;
    let startByte = 0;
    let endByte = Math.min(startByte + chunkSize, fileSize);

    let segment_index = 0;
    console.log("step 2");
    console.log("fileSize : ", fileSize);
    let total_size = 0;
    while (startByte < fileSize) {
      total_size += endByte - startByte;
      await twitterAppendMedia(
        mediaId,
        startByte,
        endByte,
        accessToken,
        segment_index,
        tempFilePath
      );
      segment_index++;
      startByte = endByte;
      endByte = Math.min(startByte + chunkSize, fileSize);
    }
    console.log("total_size : ", total_size);
    console.log("step 3");
    const finalizedMediaId = await twitterFinalizeUpload(mediaId, accessToken);
    console.log("Video uploaded successfully with media ID:", finalizedMediaId);
    console.log("step 4");

    await twitterPostTweet(
      finalizedMediaId,
      title,
      description,
      tags,
      accessToken
    );
    // Update database
    await updateDatabase(uploadRequestId, 5, platform);
    return { statusCode: 200, body: "Upload successful" };
  } catch (error) {
    console.error("Upload failed:", error);
    await updateDatabase(uploadRequestId, 6, platform);
    return { statusCode: 500, body: "Upload failed" };
  } finally {
    // Clean up temporary file
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (cleanupError) {
      console.error("Error during temporary file cleanup:", cleanupError);
    }
  }
}
async function twitterInitUpload(videoPath, accessToken, fileSize) {
  console.log("fileSize : ", fileSize);
  const form = new FormData();
  form.append("command", "INIT");
  form.append("media_type", "video/mp4");
  form.append("total_bytes", fileSize.toString());
  form.append("media_category", "tweet_video");

  // "Content-Type": "multipart/form-data",
  // Get headers and content length
  const formHeaders = form.getHeaders();
  const contentLength = await new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) reject(err);
      resolve(length);
    });
  });

  formHeaders["Content-Length"] = contentLength;

  try {
    const response = await axios.post(
      "https://api.x.com/2/media/upload",
      form,
      {
        headers: {
          ...formHeaders,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("response : ", response);
    return response.data.data.id;
  } catch (error) {
    console.error("Error initializing upload:", error);
    throw error;
  }
}

async function twitterAppendMedia(
  mediaId,
  startByte,
  endByte,
  accessToken,
  segmentIndex,
  videoPath
) {
  console.log("startByte : ", startByte);
  console.log("endByte : ", endByte);
  console.log("segmentIndex : ", segmentIndex);
  console.log("mediaId : ", mediaId);
  const form = new FormData();
  form.append("command", "APPEND");
  form.append("media_id", mediaId);
  form.append("segment_index", `${segmentIndex}`);

  const fileStream = fs.createReadStream(videoPath, {
    start: startByte,
    end: endByte - 1,
  });
  form.append("media", fileStream);
  // Get headers and content length
  const formHeaders = form.getHeaders();
  const contentLength = await new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) reject(err);
      resolve(length);
    });
  });

  formHeaders["Content-Length"] = contentLength;

  try {
    const response = await axios.post(
      "https://api.x.com/2/media/upload",
      form,
      {
        headers: {
          ...formHeaders,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("response 2: ", response);
  } catch (error) {
    console.error("Error appending media:", error);
    throw error;
  }
}

async function twitterFinalizeUpload(mediaId, accessToken) {
  console.log("mediaId : ", mediaId);
  const form = new FormData();
  form.append("command", "FINALIZE");
  form.append("media_id", mediaId);
  // Get headers and content length
  const formHeaders = form.getHeaders();
  const contentLength = await new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) reject(err);
      resolve(length);
    });
  });

  formHeaders["Content-Length"] = contentLength;

  try {
    const response = await axios.post(
      "https://api.x.com/2/media/upload",
      form,
      {
        headers: {
          ...formHeaders,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("response 3: ", response);
    return response.data.data.id;
  } catch (error) {
    console.error("Error finalizing upload:", error);
    throw error;
  }
}

async function checkMediaUploadStatus(mediaId, accessToken) {
  try {
    const response = await axios.get(
      `https://upload.twitter.com/1.1/media/upload.json?command=STATUS&media_id=${mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.processing_info.state;
  } catch (error) {
    console.error("Error checking media upload status:", error);
    throw error;
  }
}

async function twitterPostTweet(mediaId, title, description, tags) {
  // Initialize OAuth 1.0a
  const oauth = OAuth({
    consumer: { key: process.env.CONSUMER_KEY, secret: CONSUMER_SECRET },
    signature_method: "HMAC-SHA1",
    hash_function(base_string, key) {
      return crypto
        .createHmac("sha1", key)
        .update(base_string)
        .digest("base64");
    },
  });
  const token = {
    key: process.env.ACCESS_TOKEN,
    secret: process.env.ACCESS_TOKEN_SECRET,
  };

  let text = title + " - " + description + " ";
  tags.map((tag) => {
    text += `#${tag} `;
  });

  const url = "https://api.twitter.com/2/tweets";

  const authHeader = oauth.toHeader(
    oauth.authorize({ url, method: "POST" }, token)
  );

  try {
    const response = await axios.post(url, data, {
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
    });
    console.log("Tweet posted successfully:", response.data);
  } catch (error) {
    console.error(
      "Error posting tweet:",
      error.response ? error.response.data : error.message
    );
  }
}

// async function twitterPostTweet(
//   mediaId,
//   accessToken,
//   title,
//   description,
//   tags
// ) {
//   let text = title + " - " + description + " ";
//   tags.map((tag) => {
//     text += `#${tag} `;
//   });
//   const data = {
//     for_super_followers_only: false,
//     nullcast: false,
//     text: text,
//     media: {
//       media_ids: [mediaId],
//     },
//   };
//   try {
//     const response = await axios.post(
//       "https://api.twitter.com/2/tweets",
//       data,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("Tweet posted successfully:", response.data);
//   } catch (error) {
//     console.error("Error posting tweet:", error);
//   }
// }
