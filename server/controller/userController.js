const User = require("../models/userModel");
const Cloudinary = require("../models/cloudinaryModel");
const ResetPassword = require("../models/resetPasswordModel");
const sendToken = require("../utils/jwtToken");
var validator = require("validator");
const { v4: uuidv4 } = require("uuid");
const sendMail = require("../utils/sendMail");

/* Roles */
// content-creator
// service-provider

exports.registerUser = async (req, res, next) => {
  try {
    let { name, email, password, avatar, role } = req.body;
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      role === "" ||
      !avatar
    ) {
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

    const Image = await Cloudinary.create(avatar);
    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar: Image._id,
      role,
    });

    await user.populate("avatar");
    sendToken(user, 201, res, "Registration successfully");
  } catch (err) {
    await res.send({ success: false, message: err.message });
  }
};

exports.checkUser = async (req, res, next) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({ email: email });
    if (user) {
      return await res.status(400).send({
        sucess: false,
        message: "User already exists with this email id.",
      });
    } else {
      return await res.status(200).send({
        success: true,
        message: "No user exists",
      });
    }
  } catch (err) {
    return await res.status(400).send({
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

    if ((await user.comparePassword(password)) === false) {
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
    const user = await User.findById(req.user.id).populate("avatar");

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
    const { name, avatar, about } = req.body;
    const newDetails = {
      name: name,
      avatar: avatar,
      updatedAt: new Date().toISOString(),
      about: about,
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
    user.updatedAt = new Date().toISOString();

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
    user.updatedAt = new Date().toISOString();

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
exports.resetPasswordLinkGenerator = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) {
      return await res.status(400).send({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return await res.status(400).send({
        success: false,
        message: "You have not registered yet.",
      });
    }

    const id = uuidv4();
    const resetPasswordObject = await ResetPassword.create({
      uuid: id,
      userId: user._id,
    });
    sendMail(email, "Password Reset", id, user);

    return await res.status(200).send({
      success: true,
      message: "Reset password link has been sent to your email address.",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;
    const token = await ResetPassword.findOne({ uuid: resetToken }).populate(
      "userId"
    );
    if (!token) {
      return await res.status(400).send({
        success: false,
        message: "Invalid reset token or has already been used.",
      });
    }

    if (validator.isEmpty(newPassword) || validator.isEmpty(confirmPassword)) {
      return await res.status(400).send({
        success: false,
        message: "Plese fill in all the details.",
      });
    }
    if (
      !validator.isLength(newPassword, {
        min: 8,
        max: undefined,
      })
    ) {
      return await res.status(400).send({
        success: false,
        message: "Password must be atleast 8 characters long.",
      });
    }
    if (newPassword !== confirmPassword) {
      return await res.status(400).send({
        success: false,
        message: "New Password and Confirm Password are not same.",
      });
    }

    const user = await token.userId;
    const thisUser = await User.findById(user._id);

    if (
      (await thisUser.comparePassword(newPassword)) === true ||
      (await thisUser.previousPasswordCheck(newPassword)) == true
    ) {
      return await res.status(400).send({
        success: false,
        message: "New password can not be same as a previously used password.",
      });
    }

    thisUser.previousPasswords.push(thisUser.password);
    thisUser.password = newPassword;
    thisUser.updatedAt = new Date().toISOString();

    await thisUser.save();
    await ResetPassword.findByIdAndDelete(token._id);
    return await res.status(200).send({
      success: true,
      message: "Password reset successfull.",
    });
  } catch (err) {
    await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getUserDetail = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id).populate("avatar");
    if (!user) {
      return await res.status(400).send({
        success: false,
        message: "User does not exists.",
      });
    }
    let details;
    if (user.role == "content-creator") {
      // If the requested user is a content-creator
      details = {
        name: user.name,
        avatar: user.avatar,
        about: user.about,
      };
    } else if (user.role == "service-provider") {
      // If the requested user is a service-provider
      details = {
        name: user.name,
        avatar: user.avatar,
        about: user.about,
        services: user.servicesOffered,
        rating: user.rating,
        providerPreviousWork: user.providerPreviousWork,
      };
    } else {
      return await res.status(500).send({
        success: false,
        message: "Internal Server error",
      });
    }
    details.socialPlatforms = user.socialPlatform;
    return await res.status(200).send({
      success: true,
      details,
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
exports.addPlatforms = async (req, res) => {
  try {
    const { title, link } = req.body;
    const user = await User.findById(req.user.id);
    let check = false;

    user.socialPlatform.map((ele) => {
      if (ele.title.toLocaleLowerCase() === title.toLocaleLowerCase()) {
        check = true;
      }
    });
    if (check === true) {
      return await res.status(400).send({
        success: false,
        message: "You already have this link added with this title",
      });
    }
    if (!validator.isLength(title, { min: 5, max: 20 })) {
      return await res.status(400).send({
        success: false,
        message: "Title length should be in the range of 5-20.",
      });
    }
    user.socialPlatform.push({
      title,
      link,
    });
    await user.save();

    return await res.status(200).send({
      success: true,
      message: "Platform added successfully.",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.updatePlatforms = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { id, title, link } = req.body;
    if (!id || !title || !link) {
      return await res.status(400).send({
        success: false,
        message: "Please fill in all the details",
      });
    }
    if (!validator.isLength(title, { min: 5, max: 20 })) {
      return await res.status(400).send({
        success: false,
        message: "Title length should be in the range of 5-20.",
      });
    }
    let check = false;
    for (ele of user.socialPlatform) {
      if (ele._id.toString() === id.toString()) {
        check = true;
        break;
      }
    }

    if (check === false) {
      return await res.status(400).send({
        success: false,
        message: "No platform with this id is connected to your account",
      });
    }

    user.socialPlatform.forEach((ele) => {
      if (ele._id.toString() === id.toString()) {
        ele.title = title;
        ele.link = link;
      }
    });
    await user.save();

    return await res.status(200).send({
      success: true,
      message: "Project Updated successfully",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.deletePlatforms = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return await res.status(500).send({
        succes: false,
        message: "Internal server Error.",
      });
    }
    const user = await User.findById(req.user.id);
    let check = false;
    for (ele of user.socialPlatform) {
      if (ele._id.toString() === id.toString()) {
        check = true;
        break;
      }
    }

    if (check === false) {
      return await res.status(400).send({
        success: false,
        message: "No platform with this id is connected to your account",
      });
    }
    const newLinks = user.socialPlatform.filter((ele) => {
      if (ele._id.toString() !== id) return ele;
    });

    user.socialPlatform = newLinks;
    await user.save();
    return await res.status(200).send({
      success: true,
      message: "Platform deleted successfully.",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.addServices = async (req, res) => {
  try {
    const { services } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    for (let ele of services) {
      user.servicesOffered.push(ele);
    }
    await user.save();
    return await res.status(200).send({
      success: true,
      message: "Service added successfully.",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.removeServices = async (req, res) => {
  try {
    const { service } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    const newServices = await user.servicesOffered.map((ele) => {
      if (ele != service) {
        return ele;
      }
    });
    user.servicesOffered = newServices;
    await user.save();
    return await res.status(200).send({
      success: true,
      message: "Service removed successfully.",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getContentCreator = async (req, res) => {
  try {
    const { services } = req.body;
    if (services.length === 0) {
      const users = await User.find({
        role: "service-provider",
      })
        .populate("avatar")
        .select(["name", "rating", "providerPreviousWork", "experience"]);
      return await res.status(200).send({
        success: true,
        message: "Fetched all users successfully.",
        users,
      });
    }
    const users = await User.find();
    const ans = [];
    for (let service of services) {
      for (let user of users) {
        for (let ele of user.servicesOffered) {
          if (
            (await ele.toLowerCase()) === service.toLowerCase() ||
            (await ele.toLowerCase().includes(service.toLowerCase())) ||
            (await service.toLowerCase().includes(ele.toLowerCase()))
          ) {
            await user.populate("avatar");
            ans.push(user);
          }
        }
      }
    }
    return await res.status(200).send({
      success: true,
      message: "Fetched all users",
      users: ans,
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
