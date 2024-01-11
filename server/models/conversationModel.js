const mongoose = require("mongoose");
const conversationSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
    required: true,
  },
  lastMessageAt: {
    type: Date,
    default: new Date().toISOString(),
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  isGroup: {
    type: Boolean,
    required: false,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Conversation", conversationSchema);
