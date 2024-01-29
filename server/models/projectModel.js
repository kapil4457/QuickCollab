const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectTitle: {
    type: String,
    required: true,
  },
  projectLink: {
    type: String,
    required: false,
  },

  projectDescription: {
    type: String,
    required: true,
  },
  projectImages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  ],
  projectVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Project", projectSchema);
