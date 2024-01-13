const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
// const cloudinary = require("cloudinary");
var validator = require("validator");

//Register a User

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar, role } = req.body;

    if (name === "" || email === "" || password === "" || role === "") {
      return await res
        .status(401)
        .send({ success: false, message: "Please fill in all the details !!" });
    }

    if (!validator.isEmail(email)) {
      return await res.status(400).send({
        success: false,
        message: "Please enter a valid email address !!",
      });
    }

    if (
      !validator.isLength(password, {
        min: 8,
        max: undefined,
      })
    ) {
      return await res.status(400).send({
        success: false,
        message: "Password should be atleast 8 characters long",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar,
      role,
    });

    sendToken(user, 201, res, "Registration successfully");
  } catch (err) {
    await res.send({ success: false, message: err.stack });
  }
};

exports.googleRegisterUser = async (req, res) => {
  try {
    const { email, avatar, name, role } = req.body;

    const user = await User.find({
      email: email,
    });
    if (user) {
      sendToken(user, 200, res, "Logged in Successfully");
    }

    const newUser = await User.create({
      name,
      email,
      avatar,
      role,
      isGoogleLogin: true,
    });

    sendToken(newUser, 201, res, "Registeration Successfully !!");
  } catch (err) {
    await res.send({
      success: false,
      message: err.message,
    });
  }
};
