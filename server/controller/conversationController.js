const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const validator = require("validator");
exports.createConversationDetails = async (req, res) => {
  try {
    const { name, users, isGroup } = req.body;
    const user = await User.findById(req.user.id);
    if (!name || !users) {
      return await res.status(400).send({
        success: false,
        message: "Please fill in all the details.",
      });
    }
    if (
      !validator.isLength(name, {
        min: 1,
        max: 20,
      })
    ) {
      return await res.status(400).send({
        success: false,
        message: "Group name length should be in the range 1-20.",
      });
    }
    users.push(req.user.id);

    let details = {
      name: name,
      users: users,
      isGroup: isGroup,
      groudAdmin: user._id.toString(),
    };

    const conversation = await Conversation.create(details);
    for (let ele of users) {
      const currUser = await User.findById(ele.toString());
      currUser.conversations.push(conversation._id);
      await currUser.save();
    }

    return await res.status(200).send({
      success: true,
      message: "Conversation initialized successfully !!",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.addUsersToConversationGroup = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { users, conversationId } = req.body;
    const conversation = await Conversation.findById(conversationId);

    if (conversation.isGroup === false) {
      return await res.status(400).send({
        success: false,
        message: "This is not a group.",
      });
    }
    if (user._id.toString() !== conversation.groudAdmin.toString()) {
      return await res.status(400).send({
        success: false,
        message: "You are not the admin of this group.",
      });
    }

    for (let ele of users) {
      if (!conversation.users.includes(ele)) {
        conversation.users.push(ele);
      }
      const tempUser = await User.findById(ele);
      tempUser.conversations.push(conversationId);
      await tempUser.save();
    }

    await conversation.save();
    return res.status(200).send({
      success: true,
      message: "User successfully added to the group.",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
