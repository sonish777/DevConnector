const AppError = require("../utils/AppError");
const Profile = require("../models/Profile");
const axios = require("axios");
const path = require("path");

module.exports.getHome = async (req, res) => {
  res.status(200).render("landing");
};

module.exports.getLogin = async (req, res) => {
  res.status(200).render(`login`);
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
          return res.status(200).render("profile", {
            profile,
          });
        }
      } else {
        return res.status(200).render("profile", {
          profile,
        });
      }
    }
  } catch (error) {
    // console.log();
    return next(new AppError(404, error.response.data.message));
  }
};

module.exports.getEduForm = async (req, res, next) => {
  res.status(200).render("addEducation");
};

module.exports.getAllPosts = async (req, res, next) => {
  try {
    const result = await axios({
      method: "GET",
      url: "http://localhost:8000/api/posts",
      headers: {
        authorization: `Bearer ${req.cookies.jwt}`,
      },
    });
    if (result.data.status === "success") {
      // console.log(result.data.data.posts);
      result.data.data.posts.forEach((post) => {
        console.log(post.like);
      });
      res.locals.posts = result.data.data.posts;
    }
  } catch (error) {}
  res.status(200).render("posts");
};

module.exports.getPostDiscussion = async (req, res, next) => {
  const postId = req.params.postid;
  try {
    const result = await axios({
      method: "GET",
      url: `http://localhost:8000/api/posts/${postId}`,
      headers: {
        authorization: `Bearer ${req.cookies.jwt}`,
      },
    });
    if (result.data.status === "success") {
      res.locals.post = result.data.data.post;
    }
  } catch (error) {
    return next(new AppError(500, "Something went wrong"));
  }
  res.status(200).render("post");
};
