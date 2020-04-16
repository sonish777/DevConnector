const express = require("express");
const router = express.Router();

const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");

router.use(authController.isLoggedIn);

router.route("/").get(viewController.getHome);
router.route("/login").get(viewController.getLogin);
router.route("/register").get(viewController.getRegister);
router.route("/profiles").get(viewController.getProfiles);
router
  .route("/create-profile")
  .get(authController.protectRoute, viewController.createProfile);
router
  .route("/dashboard")
  .get(authController.protectRoute, viewController.getDashboard);

router.route("/profile/:devid").get(viewController.getDevProfile);

module.exports = router;
