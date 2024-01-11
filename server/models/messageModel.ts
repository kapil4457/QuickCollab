import mongoose from "mongoose";

interface messageSchemaProps {
  body: String;
  image: String;
  createdAt: String;
  seen: Array<mongoose.Schema.Types.ObjectId>;
  conversationId: mongoose.Schema.Types.ObjectId;
  senderId: mongoose.Schema.Types.ObjectId;
}
const messageSchema = new mongoose.Schema<messageSchemaProps>({
  body: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
  seen: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Message", messageSchema);
