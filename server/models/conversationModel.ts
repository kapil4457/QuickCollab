import mongoose from "mongoose";
interface conversationSchemaProps {
  createdAt: String;
  lastMessageAt: String;
  name: String;
  isGroup: Boolean;
  messages: mongoose.Schema.Types.ObjectId;
  users: mongoose.Schema.Types.ObjectId;
}
const conversationSchema = new mongoose.Schema<conversationSchemaProps>({
  createdAt: {
    type: String,
    default: new Date().toISOString(),
    required: true,
  },
  lastMessageAt: {
    type: String,
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
