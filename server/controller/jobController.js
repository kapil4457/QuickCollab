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
      skills,
    } = req.body;

    if (
      !jobTitle ||
      !jobDescription ||
      !location ||
      !estimatedTime ||
      !minPay ||
      !maxPay ||
      !skills
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

    if (estimatedTime <= 0) {
      return await res.status(400).send({
        success: false,
        message: "Estimated time can not be 0.",
      });
    }

    if (minPay <= 0) {
      return await res.status(400).send({
        success: false,
        message: "Min Pay can not be less than equal to zero.",
      });
    }
    if (skills.length === 0) {
      return await res.status(400).send({
        success: false,
        message: "Please enter atleast 1 skill.",
      });
    }

    const job = await Job.create({
      jobTitle,
      jobDescription,
      location,
      estimatedTime,
      minPay,
      skills,
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
      skills,
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
      !maxPay ||
      !skills
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
    if (skills.length === 0) {
      return await res.status(400).send({
        success: false,
        message: "Please enter atleast 1 skill.",
      });
    }

    if (estimatedTime <= 0) {
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
      skills,
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
    const jobs = await Job.find();

    if (!filters) {
      return await res.status(200).send({
        success: true,
        message: "Fetched all jobs.",
        jobs,
      });
    }

    let ans = jobs;
    let tempAns = [];
    if (filters.keywords.length !== 0) {
      for (let filter of filters.keywords) {
        let lowerFilter = filter.toLowerCase();
        for (let job of ans) {
          for (let ele of job.skills) {
            let lowerEle = ele.toLowerCase();
            if (
              lowerEle === lowerFilter ||
              lowerEle.includes(lowerFilter) ||
              lowerFilter.includes(lowerEle)
            ) {
              tempAns.push(job);
              break;
            }
          }
        }
      }

      ans = tempAns;
    }

    if (filters?.location && filters.location.length != 0) {
      let newAns = [];
      for (let loc of filters?.location) {
        for (let ele of ans) {
          if (
            ele.location.toLowerCase() === loc.toLowerCase() ||
            ele.location.toLowerCase().includes(loc.toLowerCase()) ||
            loc.toLowerCase().includes(ele.location.toLowerCase())
          ) {
            newAns.push(ele);
          }
        }
      }

      ans = newAns;
    }

    if (filters.estimatedTime != 0) {
      ans = ans.filter((ele) => {
        if (ele.estimatedTime <= filters.estimatedTime) {
          return ele;
        }
      });
    }

    if (filters.range.minPay != NaN && filters.range.minPay != 0) {
      ans = ans.filter((ele) => {
        if (ele.minPay >= filters.range.minPay) {
          return ele;
        }
      });
    }
    if (filters.range.maxPay != NaN && filters.range.maxPay != 0) {
      ans = ans.filter((ele) => {
        if (ele.maxPay <= filters.range.maxPay) {
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

exports.fetchJobApplicants = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;
    const { filters } = req.body;
    const job = await Job.findById(id).populate({
      path: "applicants",
      populate: {
        path: "avatar",
        model: "Cloudinary",
        select: ["url"],
      },
      model: "User",
      select: ["name", "avatar", "rating", "servicesOffered"],
    });
    if (!job) {
      return await res.status(400).send({
        success: false,
        message: "Job with this id does not exist.",
      });
    }
    if (job.jobCreatedBy.toString() !== userId.toString()) {
      return await res.status(400).send({
        success: false,
        message: "You are not allowed to access this job details.",
      });
    }
    let applicants = job.applicants;
    if (!filters) {
      return await res.status(200).send({
        success: true,
        message: "Fetched all applicants.",
        applicants,
        jobCreator: job.jobCreatedBy.toString(),
      });
    }
    const { keywords, rating } = filters;
    let ans = applicants;

    if (keywords.length !== 0) {
      let tempAns = [];
      for (let keyword of keywords) {
        let lowerKeyword = keyword.toLowerCase();
        for (let applicant of ans) {
          for (let skill of applicant.servicesOffered) {
            let skillLower = skill.toLowerCase();
            if (
              skillLower === lowerKeyword ||
              skillLower.includes(lowerKeyword) ||
              lowerKeyword.includes(skillLower)
            ) {
              tempAns.push(applicant);
              break;
            }
          }
        }
      }
      ans = tempAns;
    }

    if (rating !== 0) {
      ans = ans.filter((ele) => {
        if (ele.rating > rating) return ele;
      });
    }

    return await res.status(200).send({
      success: true,
      message: "Fetched all applicants",
      applicants: ans,
      jobCreator: job.jobCreatedBy.toString(),
    });
  } catch (err) {
    return res.status(400).send({
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
