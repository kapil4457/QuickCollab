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
    let length = users.length;
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
    };

    if (length > 1) {
      details.groupAdmin = user._id;
    }

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
