const User = require("../models/userModel");
const Project = require("../models/projectModel");
var validator = require("validator");

exports.addprojects = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const { projectTitle, projectDescription, projectImages, projectVideos } =
      req.body;

    if (
      !projectTitle ||
      !projectDescription ||
      !projectImages ||
      !projectVideos
    ) {
      return await res.status(400).send({
        success: false,
        message: "Please fill in all the details.",
      });
    }
    if (
      !validator.isLength(projectTitle, {
        min: 1,
        max: undefined,
      })
    ) {
      return res.status(400).send({
        success: false,
        message: "Enter a valid title.",
      });
    }
    if (
      !validator.isLength(projectDescription, {
        min: 1,
        max: 300,
      })
    ) {
      return res.status(400).send({
        success: false,
        message: "Enter a valid Description.",
      });
    }
    if (projectImages.length == 0) {
      return res.status(400).send({
        success: false,
        message: "Please provide images related to the peoject.",
      });
    }
    const project = await Project.create({
      projectTitle,
      projectDescription,
      projectImages,
      user: req.user.id,
      projectVideos,
      userId: req.user.id,
    });
    user.providerPreviousWork.push(project._id);
    await user.save();

    return await res.status(201).send({
      success: true,
      message: "Project added successfully",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.updateProjects = async (req, res) => {
  try {
    const {
      projectTitle,
      projectDescription,
      projectImages,
      projectVideos,
      id,
    } = req.body;
    if (
      !projectTitle ||
      !projectDescription ||
      !projectImages ||
      !projectVideos
    ) {
      return await res.status(400).send({
        success: false,
        message: "Please fill in all the details.",
      });
    }
    const user = await User.findById(req.user.id);

    const project = await Project.findById(id);
    if (!project) {
      return await res.status(400).send({
        success: false,
        message: "This project does not exists.",
      });
    }

    if (project.userId.toString() !== user._id.toString()) {
      return await res.status(400).send({
        success: false,
        message: "You are not allowed to update this project.",
      });
    }

    if (
      !validator.isLength(projectTitle, {
        min: 1,
        max: undefined,
      })
    ) {
      return res.status(400).send({
        success: false,
        message: "Enter a valid title.",
      });
    }
    if (
      !validator.isLength(projectDescription, {
        min: 1,
        max: 300,
      })
    ) {
      return res.status(400).send({
        success: false,
        message: "Enter a valid Description.",
      });
    }
    if (projectImages.length == 0) {
      return res.status(400).send({
        success: false,
        message: "Please provide images related to the peoject.",
      });
    }

    project.projectTitle = projectTitle;
    project.projectDescription = projectDescription;
    project.projectImages = projectImages;
    project.projectVideos = projectVideos;

    await project.save();

    return await res.status(200).send({
      success: true,
      message: "Project Updated successfully",
    });
  } catch (err) {
    return await res.status(400).send({
      success: fasle,
      message: err.message,
    });
  }
};

exports.deleteProjects = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const project = await Project.findById(id);

    if (!project) {
      return await res.status(400).send({
        success: false,
        message: "Invalid project id.",
      });
    }

    if (project.userId.toString() != user._id.toString()) {
      return await res.status(400).send({
        success: false,
        message: "You are not allowed to delete this project",
      });
    }

    const newArray = user.providerPreviousWork.filter((pre) => {
      if (pre.toString() !== id.toString()) return pre;
    });

    user.providerPreviousWork = newArray;
    await user.save();
    await Project.findByIdAndDelete(id);

    return await res.status(200).send({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};