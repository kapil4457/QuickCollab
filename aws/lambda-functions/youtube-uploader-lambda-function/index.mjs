import { google } from "googleapis";
import axios from "axios";
import pg from "pg";
const { Client } = pg;
import fs from "fs";
import path from "path";
import os from "os";

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
      case "FACEBOOK":
        await facebookUploadHandler(
          accessToken,
          title,
          description,
          tags,
          tempFilePath,
          uploadRequestId,
          platform
        );
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

async function facebookUploadHandler(
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

    if (statuses.every((s) => s === "UPLOAD_COMPLETED")) {
      finalStatus = 5;
    } else if (statuses.includes("UPLOAD_FAILED")) {
      finalStatus = 6;
    }

    // Step 3: Update upload_request_status accordingly
    const updateRequestStatusQuery = `
    UPDATE uploads SET upload_request_status = $1 WHERE upload_request_id = $2;
    `;
    await client.query(updateRequestStatusQuery, [
      finalStatus,
      uploadRequestId,
    ]);
  }
  await client.end();
}
