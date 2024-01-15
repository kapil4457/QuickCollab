const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectTitle: {
    type: String,
    required: true,
  },
  projectDescription: {
    type: String,
    required: true,
  },
  projectImages: [
    {
      type: String,
      required: true,
    },
  ],
  projectVideos: [
    {
      type: String,
      required: true,
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Project", projectSchema);
