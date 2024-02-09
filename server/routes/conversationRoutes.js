const express = require("express");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const {
  createConversationDetails,
  addUsersToConversationGroup,
  removeUsersFromConversationGroup,
  updateGroup,
  deleteGroup,
  leaveGroup,
  getConversations,
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

router
  .route("/user/delete/conversation/:id")
  .delete(isAuthenticatedUser, authorizeRole("content-creator"), deleteGroup);

router.route("/user/leave/conversation/").put(isAuthenticatedUser, leaveGroup);

router.route("/user/getContacts").get(isAuthenticatedUser, getConversations);

module.exports = router;
