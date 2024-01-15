const express = require("express");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const {
  createConversationDetails,
  addUsersToConversationGroup,
  removeUsersFromConversationGroup,
  updateGroup,
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
  .route("/user/addto/conversation/")
  .post(
    isAuthenticatedUser,
    authorizeRole("content-creator"),
    addUsersToConversationGroup
  );
router
  .route("/user/removefrom/conversation/")
  .post(
    isAuthenticatedUser,
    authorizeRole("content-creator"),
    removeUsersFromConversationGroup
  );
router
  .route("/user/updatein/conversation/")
  .put(isAuthenticatedUser, authorizeRole("content-creator"), updateGroup);

module.exports = router;
