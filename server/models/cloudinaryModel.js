const mongoose = require("mongoose");

const cloudinarySchema = new mongoose.Schema({
  asset_id: {
    type: String,
    required: false,
  },
  public_id: {
    type: String,
    required: false,
  },
  version: {
    type: String,
    required: false,
  },
  version_id: {
    type: String,
    required: false,
  },
  signature: {
    type: String,
    required: false,
  },

  width: {
    type: Number,
    required: false,
  },
  height: {
    type: Number,
    required: false,
  },
  format: {
    type: String,
    required: false,
  },
  resource_type: {
    type: String,
    required: false,
  },
  created_at: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  etag: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
  folder: {
    type: String,
    required: false,
  },
  original_filename: {
    type: String,
    required: false,
  },
  isGoogleAuthImage: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Cloudinary", cloudinarySchema);
