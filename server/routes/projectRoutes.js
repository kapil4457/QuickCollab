const express = require("express");
const {
  addprojects,
  updateProjects,
  deleteProjects,
} = require("../controller/projectController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router
  .route("/me/create/project")
  .post(isAuthenticatedUser, authorizeRole("service-provider"), addprojects);
router
  .route("/me/update/project")
  .put(isAuthenticatedUser, authorizeRole("service-provider"), updateProjects);
router
  .route("/me/delete/project/:id")
  .delete(
    isAuthenticatedUser,
    authorizeRole("service-provider"),
    deleteProjects
  );
module.exports = router;
