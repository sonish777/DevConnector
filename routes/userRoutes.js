const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController.js");
const authController = require("./../controllers/authController");

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.registerUser);

router.route("/login").post(authController.login);
router.route("/logout").post(authController.logOut);

module.exports = router;
