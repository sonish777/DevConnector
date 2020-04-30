const express = require("express");
const router = express.Router();
// const multer = require("multer");

const AppError = require("../utils/AppError");
const authController = require("../controllers/authController");
const profileController = require("../controllers/profileController");

router
  .route("/")
  .get(profileController.getAllProfile)
  .delete(authController.protectRoute, profileController.deleteMe)
  .post(
    authController.protectRoute,
    profileController.uploadImage,
    profileController.resizeImage,
    profileController.createProfile
  );

router.route("/user/:id").get(profileController.getByUserId);

router
  .route("/experience")
  .post(authController.protectRoute, profileController.addExperinces);

router
  .route("/education")
  .post(authController.protectRoute, profileController.addEducation);

router
  .route("/experience/:expid")
  .delete(authController.protectRoute, profileController.deleteExperiece);

router
  .route("/education/:eduid")
  .delete(authController.protectRoute, profileController.deleteEducation);

router
  .route("/me")
  .get(authController.protectRoute, profileController.getMyProfile);

router.route("/github/:username").get(profileController.getGetRepos);

module.exports = router;
