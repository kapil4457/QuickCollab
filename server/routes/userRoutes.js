const express = require("express");
const {
  registerUser,
  googleRegisterUser,
  loginUser,
  logout,
  getUserDetails,
  updateProfile,
  updateAvailabilityStatus,
  updatePassword,
  resetPassword,
  resetPasswordLinkGenerator,
  getUserDetail,
  addPlatforms,
  updatePlatforms,
  deletePlatforms,
  checkUser,
} = require("../controller/userController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const router = express.Router();

router.route("/sign-up").post(registerUser);
router.route("/check/user").get(checkUser);
// router.route("/sign-up-google").post(googleRegisterUser);

router.route("/sign-in").post(loginUser);

router.route("/sign-out").post(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router
  .route("/me/update/availability")
  .put(isAuthenticatedUser, updateAvailabilityStatus);

router.route("/me/updatePassword").put(isAuthenticatedUser, updatePassword);

router
  .route("/me/resetPassword")
  .post(resetPasswordLinkGenerator)
  .put(resetPassword);

router.route("/user/details/:id").get(isAuthenticatedUser, getUserDetail);

router
  .route("/me/addplatforms")
  .post(isAuthenticatedUser, authorizeRole("content-creator"), addPlatforms);

router.route("/me/updateplatforms").post(isAuthenticatedUser, updatePlatforms);

router
  .route("/me/deleteplatforms/:id")
  .delete(isAuthenticatedUser, deletePlatforms);

module.exports = router;
