const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  skills: [
    {
      type: String,
      required: true,
    },
  ],
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
  estimatedTime: {
    type: Number,
    required: true,
  },
  minPay: {
    type: Number,
    required: true,
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  maxPay: {
    type: Number,
    required: true,
  },
  jobCreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Job", jobSchema);
