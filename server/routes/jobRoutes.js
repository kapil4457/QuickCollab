const express = require("express");
const {
  createJob,
  deleteJob,
  updateJob,
  applyToJob,
} = require("../controller/jobController");
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
  .get(isAuthenticatedUser, authorizeRole("service-provider"), fetchJobs);
router
  .route("/apply/job/:id")
  .put(isAuthenticatedUser, authorizeRole("service-provider"), applyToJob);

module.exports = router;
