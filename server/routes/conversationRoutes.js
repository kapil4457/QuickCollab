const express = require("express");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const {
  createConversationDetails,
  addUsersToConversationGroup,
} = require("../controller/conversationController");

const router = express.Router();

router
  .route("/user/create/conversation/")
  .post(
    isAuthenticatedUser,
    authorizeRole("content-creator"),
    createConversationDetails
  );

router
  .route("/user/add/user/conversation/")
  .post(
    isAuthenticatedUser,
    authorizeRole("content-creator"),
    addUsersToConversationGroup
  );

module.exports = router;
