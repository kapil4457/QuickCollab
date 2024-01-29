const mongoose = require("mongoose");

const cloudinarySchema = new mongoose.Schema({
  asset_id: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  // version: {
  //   type: String,
  //   required: true,
  // },
  // version_id: {
  //   type: String,
  //   required: true,
  // },
  signature: {
    type: String,
    required: true,
  },

  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  resource_type: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  // etag: {
  //   type: String,
  //   required: true,
  // },
  url: {
    type: String,
    required: true,
  },
  folder: {
    type: String,
    required: true,
  },
  // original_filename: {
  //   type: String,
  //   required: true,
  // },
});

module.exports = mongoose.model("Cloudinary", cloudinarySchema);
