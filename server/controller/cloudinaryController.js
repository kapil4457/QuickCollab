const { v2: cloudinary } = require("cloudinary");
const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
exports.sign = async (req, res) => {
  try {
    const folder = req.query.folder;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const upload_preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const signature = cloudinary.utils.api_sign_request(
      {
        folder,
        timestamp,
        upload_preset,
      },
      cloudinaryConfig.api_secret
    );
    return await res.status(200).send({
      success: true,
      signature: signature,
      timestamp: timestamp,
    });
  } catch (err) {
    console.log(err);
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
