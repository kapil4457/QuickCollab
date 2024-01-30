import axios from "axios";
import requestHandler from "./requestHelper";

const cloudinaryUploader = async ({
  ele,
  location,
  type,
}: {
  ele: File;
  location: string;
  type: string;
}) => {
  const formData2 = new FormData();
  const api_key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string;
  formData2.append("file", ele);
  formData2.append("upload_preset", "content_management_system");
  formData2.append("folder", location);
  const signatureRequest = await requestHandler(
    "",
    "GET",
    `/api/v1/get-signature?folder=${location}`
  );
  formData2.append("signature", signatureRequest.signature);
  formData2.append("timestamp", signatureRequest.timestamp);
  formData2.append("api_key", api_key as string);

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${type}/upload`,
    formData2
  );
  let image = {
    asset_id: data.asset_id,
    public_id: data.public_id,
    // version: data.version,
    // version_id: data.version_id,
    signature: data.signature,
    width: data.width,
    height: data.height,
    format: data.format,
    resource_type: data.resource_type,
    created_at: data.created_at,
    type: data.type,
    // etag: data.etag,
    url: data.url,
    folder: data.folder,
    // original_filename: data.original_filename,
  };
  return image;
};

export default cloudinaryUploader;
