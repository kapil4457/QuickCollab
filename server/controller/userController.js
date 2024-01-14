const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const bcrypt = require("bcryptjs");
var validator = require("validator");
// const cloudinary = require("cloudinary");

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

    if (role !== "content-creator" && role !== "service-provider") {
      return await res.status(500).send({
        success: false,
        message: "Internal Server Erroe",
      });
    }
    const tempUser = await User.findOne({ email: email });
    if (tempUser) {
      return await res.status(400).send({
        success: false,
        message: "An account already exists with this email id",
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
    await res.send({ success: false, message: err.message });
  }
};

exports.googleRegisterUser = async (req, res) => {
  try {
    const { email, avatar, name, role } = req.body;

    const user = await User.findOne({
      email: email,
    });
    if (user) {
      sendToken(user, 200, res, "Logged in Successfully");
    }
    if (role !== "content-creator" && role !== "service-provider") {
      return await res.status(500).send({
        success: false,
        message: "Internal Server Error",
      });
    }

    const newUser = await User.create({
      name,
      email,
      avatar,
      role,
      isGoogleLogin: true,
    });

    sendToken(newUser, 201, res, "Registration Successfully !!");
  } catch (err) {
    await res.send({
      success: false,
      message: err.message,
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return await res
        .status(400)
        .send({ success: false, message: "Please fill in all the details !!" });
    }
    if (!validator.isEmail(email)) {
      return await res.status(400).send({
        success: false,
        message: "Please enter a valid email address !!",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return await res.status(400).send({
        success: false,
        message: "Email or password is wrong!!",
      });
    }

    if (!user.comparePassword(password)) {
      return await res.status(400).send({
        success: false,
        message: "Email or password is wrong!!",
      });
    }

    sendToken(user, 200, res, "Logged in successfully!!");
  } catch (err) {
    await res.send({
      success: false,
      message: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    await res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    await res
      .status(200)
      .json({ success: true, message: "logged out successfully" });
  } catch (err) {
    await res.send({
      success: false,
      message: err.message,
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) {
      return await res.status(404).send({
        success: false,
        message: "Please login to access this.",
      });
    }
    const user = await User.findById(req.user.id);

    return await res.status(200).send({
      success: true,
      user,
    });
  } catch (err) {
    await res.status(400).send({ success: false, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const newDetails = {
      name: name,
      avatar: avatar,
    };
    if (name == "") {
      return await res.status(400).send({
        success: false,
        message: "Please enter a valid name.",
      });
    }
    const user = await User.findByIdAndUpdate(req.user.id, newDetails, {
      new: true,
      runValidators: true,
    });
    return await res.status(201).send({
      success: true,
      message: "User details updated successfully!!",
      user,
    });
  } catch (err) {
    return await res.send({
      success: false,
      message: err.message,
    });
  }
};

exports.updateAvailabilityStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "service-provider") {
      return await res.status(400).send({
        success: false,
        message: "Your role does not have this functionality.",
      });
    }
    if (user.available === false) {
      user.available = true;
    } else {
      user.available = false;
    }
    await user.save();
    return await res.status(201).send({
      success: true,
      message: "Updated the availability status",
      user,
    });
  } catch (err) {
    return await res.send({
      success: false,
      message: err.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { previousPassword, updatedPassword, confirmUpdatedPassword } =
      req.body;

    if (previousPassword == updatedPassword) {
      return await res.status(400).send({
        success: false,
        message: "New password can not be same as old password",
      });
    }

    const user = await User.findById(req.user.id);

    if ((await user.comparePassword(previousPassword)) === false) {
      return await res.status(400).send({
        success: false,
        message: "Incorrect password entered.",
      });
    }

    if (updatedPassword !== confirmUpdatedPassword) {
      return await res.status(400).send({
        success: false,
        message: "Updated Password does not match the confirm password!!",
      });
    }

    if (
      !validator.isLength(updatedPassword, {
        min: 8,
        max: undefined,
      })
    ) {
      return await res.status(400).send({
        success: false,
        message: "Updated Password must be atleast 8 characters long.",
      });
    }

    if ((await user.previousPasswordCheck(updatedPassword)) == true) {
      return await res.status(400).send({
        success: false,
        message:
          "You have already used this password before.Please enter a new password.",
      });
    }
    user.previousPasswords.push(user.password);
    user.password = updatedPassword;
    await user.save();

    return await res.status(200).send({
      succes: true,
      message: "Password Updated successfully.",
    });
  } catch (err) {
    await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
