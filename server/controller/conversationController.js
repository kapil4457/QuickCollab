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
      if (!tempUser.conversations.includes(conversationId)) {
        tempUser.conversations.push(conversationId);
      }
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

exports.removeUsersFromConversationGroup = async (req, res) => {
  try {
    const { userId, conversationId } = req.body;

    const conversation = await Conversation.findById(conversationId);
    const user = await User.findById(userId);

    if (!conversation) {
      return await res.status(400).send({
        success: false,
        message: "This conversation does not exist.",
      });
    }
    if (!user) {
      return await res.status(400).send({
        success: false,
        message: "This user does not exits.",
      });
    }
    if (conversation.isGroup === false) {
      return await res.status({
        success: false,
        message: "This is not a group conversation.",
      });
    }

    if (conversation.groudAdmin.toString() !== req.user.id.toString()) {
      return await res.status(400).send({
        success: false,
        message: "You are not allowed to perform this operation",
      });
    }
    let check = false;
    for (let user of conversation.users) {
      if (user.toString() === userId.toString()) {
        check = true;
        break;
      }
    }
    if (check == false) {
      return await res.status(400).send({
        success: false,
        message: "This user is not a part of this conversation.",
      });
    }

    let newUsers = conversation.users.filter((ele) => {
      if (ele.toString() !== userId) {
        return ele;
      }
    });

    let newConversations = user.conversations.filter((ele) => {
      if (ele.toString() !== conversationId.toString()) {
        return ele;
      }
    });
    conversation.users = newUsers;
    user.conversations = newConversations;
    await conversation.save();
    await user.save();

    return await res.status(200).send({
      success: true,
      message: "User removed from the group.",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const { name, conversationId } = req.body;
    const conversation = await Conversation.findById(conversationId);
    const userId = req.user.id;
    if (conversation.isGroup === false) {
      return await res.status(400).send({
        success: false,
        message:
          "The conversation you are trying to update is not a group conversation.",
      });
    }

    if (conversation.groupAdmin.toString() !== userId.toString()) {
      return await res.status(400).send({
        success: false,
        message: "You are not allowed to update this group info.",
      });
    }

    conversation.name = name;
    await conversation.save();
    return res.status(200).send({
      success: true,
      message: "Group info changed successfully.",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteGroup = async (req, res) => {};

exports.leaveGroup = async (req, res) => {};
