const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
// const cloudinary = require("cloudinary");

//Register a User

exports.registerUser = async (req, res, next) => {
  try {
    let role = "user";
    if (req.body.role) {
      role = "admin";
    }

    const { name, email, password, avatar } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar,
    });

    sendToken(user, 201, res);
  } catch (err) {
    await res.send({ success: false, message: err.stack });
  }
};
