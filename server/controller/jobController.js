const Job = require("../models/jobModel");
const User = require("../models/userModel");
var validator = require("validator");

exports.createJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const {
      jobTitle,
      jobDescription,
      location,
      estimatedTime,
      minPay,
      maxPay,
    } = req.body;

    if (
      !jobTitle ||
      !jobDescription ||
      !location ||
      !estimatedTime ||
      !minPay ||
      !maxPay
    ) {
      return await res.status(400).send({
        success: false,
        message: "Please fill in all the details",
      });
    }

    if (
      !validator.isLength(jobTitle, {
        min: 1,
        max: undefined,
      })
    ) {
      return await res.status(400).send({
        success: false,
        message: "Title can not be empty.",
      });
    }
    if (
      !validator.isLength(jobDescription, {
        min: 1,
        max: undefined,
      })
    ) {
      return await res.status(400).send({
        success: false,
        message: "Description can not be empty.",
      });
    }
    if (
      !validator.isLength(location, {
        min: 1,
        max: undefined,
      })
    ) {
      return await res.status(400).send({
        success: false,
        message: "Location can not be empty.",
      });
    }

    if (
      !validator.isLength(estimatedTime, {
        min: 1,
        max: undefined,
      })
    ) {
      return await res.status(400).send({
        success: false,
        message: "Estimated time can not be empty.",
      });
    }

    if (minPay <= 0) {
      return await res.status(400).send({
        success: false,
        message: "Min Pay can not be less than equal to zero.",
      });
    }

    const job = await Job.create({
      jobTitle,
      jobDescription,
      location,
      estimatedTime,
      minPay,
      maxPay,
      jobCreatedBy: req.user.id,
    });
    await user.jobs.push(job._id);
    await user.save();

    return await res.status(201).send({
      success: true,
      message: "Job created successfully.",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(req.user.id);
    const job = await Job.findById(id);
    if (!job) {
      return await res.status(400).send({
        success: false,
        message: "This job does not exist.",
      });
    }
    if (job.jobCreatedBy.toString() !== user._id.toString()) {
      return await res.status(400).send({
        succes: false,
        message: "You are not allowed to perform this job.",
      });
    }

    let newJobs = user.jobs?.filter((item) => {
      if (item.toString() !== id.toString()) {
        return item;
      }
    });

    user.jobs = newJobs;
    await user.save();

    await job.applicants.map(async (item) => {
      let userId = item;
      const applicant = await User.findById(userId);
      if (applicant) {
        let newJobs = applicant.jobsAppliedTo.filter((ele) => {
          if (ele.toString() !== id.toString()) {
            return ele;
          }
        });
      }
      applicant.jobsAppliedTo = newJobs;
      await applicant.save();
    });

    await Job.findByIdAndDelete(id);
    return await res.status(200).send({
      success: true,
      message: "Job Deleted Successfully.",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const {
      jobTitle,
      jobDescription,
      location,
      estimatedTime,
      minPay,
      maxPay,
      jobId,
    } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return await res.status(400).send({
        success: false,
        message: "This job does not exists",
      });
    }
    if (job.jobCreatedBy.toString() !== user._id.toString()) {
      return await res.status(400).send({
        success: false,
        message: "You are not allowed to perform this action",
      });
    }

    if (
      !jobTitle ||
      !jobDescription ||
      !location ||
      !estimatedTime ||
      !minPay ||
      !maxPay
    ) {
      return await res.status(400).send({
        success: false,
        message: "Please fill in all the details",
      });
    }

    if (
      !validator.isLength(jobTitle, {
        min: 1,
        max: undefined,
      })
    ) {
      return await res.status(400).send({
        success: false,
        message: "Title can not be empty.",
      });
    }
    if (
      !validator.isLength(jobDescription, {
        min: 1,
        max: undefined,
      })
    ) {
      return await res.status(400).send({
        success: false,
        message: "Description can not be empty.",
      });
    }
    if (
      !validator.isLength(location, {
        min: 1,
        max: undefined,
      })
    ) {
      return await res.status(400).send({
        success: false,
        message: "Location can not be empty.",
      });
    }

    if (
      !validator.isLength(estimatedTime, {
        min: 1,
        max: undefined,
      })
    ) {
      return await res.status(400).send({
        success: false,
        message: "Estimated time can not be empty.",
      });
    }

    if (minPay <= 0) {
      return await res.status(400).send({
        success: false,
        message: "Min Pay can not be less than equal to zero.",
      });
    }

    const info = {
      jobTitle,
      jobDescription,
      location,
      estimatedTime,
      minPay,
      maxPay,
    };
    await Job.findByIdAndUpdate(jobId, info);
    return await res.status(200).send({
      success: true,
      message: "Job updated successfully.",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

// filter => keywords , range , location , estimatedTime
exports.fetchJobs = async (req, res) => {
  try {
    const { filters } = req.body;
    const jobs = await Job.find().select([
      "skills",
      "jobTitle",
      "jobDescription",
      "location",
      "createdAt",
      "estimatedTime",
      "minPay",
      "maxPay",
      "jobCreatedBy",
    ]);
    if (!filters) {
      return await res.status(200).send({
        success: true,
        message: "Fetched all jobs.",
        jobs,
      });
    }

    let ans = [];
    for (let filter of filters.keywords) {
      for (let job of jobs) {
        for (let ele of job.skills) {
          if (
            (await ele.toLowerCase()) === filter.toLowerCase() ||
            (await ele.toLowerCase().includes(filter.toLowerCase())) ||
            (await filter.toLowerCase().includes(ele.toLowerCase()))
          ) {
            ans.push(job);
          }
        }
      }
    }

    if (filters.location) {
      ans = ans.filter((ele) => {
        if (
          ele.location.toLowerCase() === filters.location.toLowerCase() ||
          ele.location.toLowerCase().includes(filters.location.toLowerCase()) ||
          filters.location.toLowerCase().includes(ele.location.toLowerCase())
        ) {
          return ans;
        }
      });
    }

    if (filters.estimatedTime) {
      ans.filter((ele) => {
        if (ele.estimatedTime <= filters.estimatedTime) {
          return ele;
        }
      });
    }

    if (filters.range.minPay) {
      ans.filter((ele) => {
        if (ele.minPay >= filters.range.minPay) {
          return ele;
        }
      });
    }
    if (filters.range.maxPay) {
      ans.filter((ele) => {
        if (ele.maxPay >= filters.range.maxPay) {
          return ele;
        }
      });
    }

    return await res.status(200).send({
      success: true,
      message: "Fetched all jobs.",
      jobs: ans,
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.applyToJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const user = await User.findById(req.user.id);
    const job = await Job.findById(jobId);

    if (!job) {
      return await res.status(400).send({
        success: false,
        message: "This job does not exists.",
      });
    }

    if (job.applicants.includes(user._id)) {
      return await res.status(400).send({
        success: false,
        message: "You have already applied to this job.",
      });
    }

    job.applicants.push(user._id);
    user.jobsAppliedTo.push(job._id);
    await job.save();
    await user.save();
    return await res.status(200).send({
      success: true,
      message: "Applied successfully",
    });
  } catch (err) {
    return await res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
