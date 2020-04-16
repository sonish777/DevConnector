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
  try {
    const result = await axios({
      method: "GET",
      url: "http://localhost:8000/api/profiles",
    });
    const developers = result.data.profiles;
    res.status(200).render("profiles", {
      developers,
    });
  } catch (error) {
    console.log(error);
  }
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

module.exports.getDashboard = async (req, res, next) => {
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
    // return next(new AppError(401, "Not logged in"));
  }
  res.status(200).render("dashboard", {
    profile,
  });
};

module.exports.getDevProfile = async (req, res, next) => {
  const devId = req.params.devid;
  console.log(devId);
  try {
    const resultProfile = await axios({
      method: "GET",
      url: `http://localhost:8000/api/profiles/user/${devId}`,
    });

    if (resultProfile.data.status === "success") {
      const profile = resultProfile.data.profile;
      if (profile.githubUsername) {
        try {
          const resultRepos = await axios({
            method: "GET",
            url: `http://localhost:8000/api/profiles/github/${profile.githubUsername}`,
          });
          const repos = resultRepos.data.data.repos;
          return res.status(200).render("profile", {
            profile,
            repos,
          });
        } catch (error) {
          // console.log(error);
          return next(new AppError(404, error.response.data.message));
        }
      }
      res.status(200).render("profile", {
        profile,
      });
    }
  } catch (error) {
    // console.log();
    return next(new AppError(404, error.response.data.message));
  }
};
