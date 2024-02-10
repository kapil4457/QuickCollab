const Conversation = require("../models/conversationModel");
const Cloudinary = require("../models/cloudinaryModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
exports.createMessage = async (req, res) => {
  try {
    const { conversationId, body, image } = req.body;
    console.log;
    const senderId = req.user.id;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation.members.includes(senderId)) {
      return await res.status(500).send({
        success: false,
        message: "Internal server Error.",
      });
    }
    let message;
    if (image) {
      let newImage = await Cloudinary.create(image);
      message = await Message.create({
        body,
        image: newImage._id,
        conversationId,
        senderId,
      });
    } else {
      message = await Message.create({
        body,
        conversationId,
        senderId,
      });
    }
    conversation.messages.push(message._id);
    await conversation.save();
    for (let ele of conversation.members) {
      let tempUser = await User.findById(ele.toString());
      tempUser.messages.push(message._id);
      await tempUser.save();
    }

    return await res.status(200).send({
      success: true,
      message: "Message sent successfully",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
