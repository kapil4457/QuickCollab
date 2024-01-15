const express = require("express");
const { createMessage } = require("../controller/messageController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

router
  .route("/conversation/create/message")
  .post(isAuthenticatedUser, createMessage);

module.exports = router;
