const express = require("express");
const { sign } = require("../controller/cloudinaryController");

const router = express.Router();

router.route("/get-signature").get(sign);

module.exports = router;
