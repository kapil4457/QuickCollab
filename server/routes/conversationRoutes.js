const express = require("express");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const {
  createConversationDetails,
} = require("../controller/conversationController");

const router = express.Router();

router
  .route("/user/create/conversation/")
  .post(
    isAuthenticatedUser,
    authorizeRole("content-creator"),
    createConversationDetails
  );

module.exports = router;
