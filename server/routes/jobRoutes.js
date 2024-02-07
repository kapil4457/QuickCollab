const express = require("express");
const {
  createJob,
  deleteJob,
  updateJob,
  applyToJob,
  fetchJobs,
  fetchJobApplicants,
} = require("../controller/jobController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const router = express.Router();

router
  .route("/create/job")
  .post(isAuthenticatedUser, authorizeRole("content-creator"), createJob);

router
  .route("/delete/job/:id")
  .delete(isAuthenticatedUser, authorizeRole("content-creator"), deleteJob);
router
  .route("/update/job")
  .put(isAuthenticatedUser, authorizeRole("content-creator"), updateJob);
router
  .route("/fetch/jobs")
  .post(isAuthenticatedUser, authorizeRole("service-provider"), fetchJobs);
router
  .route("/apply/job/:id")
  .put(isAuthenticatedUser, authorizeRole("service-provider"), applyToJob);
router
  .route("/fetch/job/applicants/:id")
  .post(
    isAuthenticatedUser,
    authorizeRole("content-creator"),
    fetchJobApplicants
  );

module.exports = router;
