const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const validator = require("validator");
const { v4: uuidv4 } = require("uuid");

exports.createConversationDetails = async (req, res) => {
  try {
    const { name, members, isGroup, groupLogo } = req.body;
    const user = await User.findById(req.user.id);
    if (isGroup === false) {
      const checkConversation = await Conversation.findOne({
        uuid: members[0].toString(),
      });
      if (checkConversation) {
        return await res.status(200).send({
          success: true,
          message: "Conversation already initialized.",
        });
      }

      if (!groupLogo) {
        return await res.status(400).send({
          success: false,
          message: "Please select a group logo.",
        });
      }
    }
    if (!members || isGroup === null) {
      return await res.status(400).send({
        success: false,
        message: "Please fill in all the details.",
      });
    }
    if (name) {
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
    }

    members.push(req.user.id);
    let details = {
      members: members,
      isGroup: isGroup,
      groupAdmin: user._id.toString(),
    };
    if (!isGroup) {
      details.uuid = members[0].toString();
    }
    if (isGroup) {
      const Image = await Cloudinary.create(avatar);
      details.groupLogo = Image._id;
      details.name = name;
    }

    const conversation = await Conversation.create(details);
    for (let ele of members) {
      const currUser = await User.findById(ele.toString());
      currUser.conversations.push(conversation._id);
      await currUser.save();
    }
    await user.save();

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
    const { members, conversationId } = req.body;
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

    for (let ele of members) {
      if (!conversation.members.includes(ele)) {
        conversation.members.push(ele);
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
    for (let user of conversation.members) {
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

    let newMembers = conversation.members.filter((ele) => {
      if (ele.toString() !== userId) {
        return ele;
      }
    });

    let newConversations = user.conversations.filter((ele) => {
      if (ele.toString() !== conversationId.toString()) {
        return ele;
      }
    });
    conversation.members = newMembers;
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

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate({
        path: "conversations",
        model: "Conversation",
        populate: {
          path: "members",
          model: "User",
          select: ["avatar", "name", "_id", "role"],
          populate: {
            path: "avatar",
            model: "Cloudinary",
            select: ["url"],
          },
        },
      })
      .populate({
        path: "conversations",
        model: "Conversation",
        populate: {
          path: "messages",
          model: "Message",
        },
      })
      .populate({
        path: "conversations",
        model: "Conversation",
        populate: {
          path: "groupAdmin",
          model: "User",
          populate: {
            path: "avatar",
            model: "Cloudinary",
            select: ["url"],
          },
          select: ["name", "avatar"],
        },
      })
      .populate({
        path: "conversations",
        model: "Conversation",
        populate: {
          path: "messages",
          populate: {
            path: "senderId",
            model: "User",
            populate: {
              path: "avatar",
              model: "Cloudinary",
              select: ["url"],
            },
            select: ["name", "avatar"],
          },
          select: ["body", "createdAt", "senderId"],
        },
      });

    return await res.status(200).send({
      success: true,
      message: "Fetched all contacts",
      conversations: user?.conversations,
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return await res.status(400).send({
        success: false,
        message: "This conversation does not exist.",
      });
    }

    if (conversation.isGroup === false) {
      return await res.status(400).send({
        success: false,
        message: "This conversation is not a group conversation.",
      });
    }
    if (conversation.groupAdmin.toString() !== userId.toString()) {
      return await res.status(400).send({
        success: false,
        message: "You are not allowed to perform this action",
      });
    }

    // remove this conversation from the list of user participants

    for (let ele of conversation.members) {
      const tempUser = await User.findById(ele);
      const newConversations = tempUser.conversations.filter(
        (currentConversation) => {
          if (currentConversation.toString() !== conversationId) {
            return currentConversation;
          }
        }
      );
      tempUser.conversations = newConversations;
      await tempUser.save();
    }

    await Conversation.findByIdAndDelete(conversationId);

    return await res.status(200).send({
      success: true,
      message: "Group deleted Successfully",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return await res.status(400).send({
        success: false,
        message: "This conversation does not exist.",
      });
    }

    if (conversation.isGroup === false) {
      return await res.status(400).send({
        success: false,
        message: "This is not a group conversation.",
      });
    }
    if (!conversation.members.includes(userId)) {
      return await res.status(400).send({
        success: false,
        message: "You are not a part of this group",
      });
    }

    const newMembers = conversation.members.filter((ele) => {
      if (ele.toString() !== userId) {
        return ele;
      }
    });

    conversation.members = newMembers;
    await conversation.save();

    //   remove this conversation from the users list of conversation

    const newConversations = user.conversations.filter((ele) => {
      if (ele.toString() !== conversationId.toString()) {
        return ele;
      }
    });

    user.conversations = newConversations;
    await user.save();

    return await res.status(200).send({
      success: true,
      messge: "You successfully left the group.",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
