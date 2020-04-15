const AppError = require("../utils/AppError");
const Profile = require("../models/Profile");
const axios = require("axios");

module.exports.getHome = async (req, res) => {
  res.status(200).render("landing");
};

module.exports.getLogin = async (req, res) => {
  res.status(200).render("login");
};

module.exports.getRegister = async (req, res) => {
  res.status(200).render("register");
};

module.exports.getProfiles = async (req, res) => {
  res.status(200).render("profiles");
};

module.exports.createProfile = async (req, res, next) => {
  let profile = "";
  if (!res.locals.user) {
    return next(new AppError(401, "You are not logged in. Please login again"));
  }
  try {
    const result = await axios({
      method: "GET",
      url: `http://localhost:8000/api/profiles/user/${req.user.id}`,
    });

    if (result.data.status === "success") {
      profile = result.data.profile;
      console.log(profile);
    }
  } catch (error) {
    // next();
  }

  res.status(200).render("createProfile", {
    profile,
  });
};
