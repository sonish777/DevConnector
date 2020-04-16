const AppError = require("../utils/AppError");
const Profile = require("../models/Profile");
const User = require("../models/User");
const axios = require("axios");

module.exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return next(new AppError(404, "There is no profile for this user"));
    }

    res.status(200).json({
      status: "success",
      data: {
        profile,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(500, "Something went wrong"));
  }
};

const createSocialObject = (body) => {
  let newObj = {};
  const socialApps = [
    "facebook",
    "youtube",
    "linkedin",
    "twitter",
    "instagram",
  ];
  Object.keys(body).forEach((key) => {
    if (socialApps.includes(key)) {
      newObj[key] = body[key];
    }
  });
  return newObj;
};

module.exports.createProfile = async (req, res, next) => {
  if (req.body.skills) {
    req.body.skills = req.body.skills.split(",").map((skill) => skill.trim());
  } else {
    return next(new AppError(400, "Please provide your skills"));
  }
  const socialObj = createSocialObject(req.body);
  if (socialObj != {} || socialObj || socialObj.length > 0) {
    req.body.social = socialObj;
  }
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      const newProfile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).json({
        status: "success",
        data: {
          profile: newProfile,
        },
      });
    }

    req.body.user = req.user.id;
    profile = await Profile.create(req.body);
    return res.status(200).json({
      status: "success",
      data: {
        profile,
      },
    });
  } catch (error) {
    return next(new AppError(500, error.message));
  }
};

module.exports.getAllProfile = async (req, res, next) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json({
      status: "success",
      profiles,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(500, "Something went wrong"));
  }
};

module.exports.getByUserId = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id });

    if (!profile) {
      return next(
        new AppError(404, "The profile for given user ID was not found")
      );
    }

    res.status(200).json({
      status: "success",
      profile,
    });
  } catch (error) {
    // console.log(error);
    if (error.name === "CastError") {
      return next(
        new AppError(404, "The profile for given user ID was not found")
      );
    }
    return next(new AppError(500, "Something went wrong"));
  }
};

module.exports.deleteMe = async (req, res, next) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(500, "Something went wrong"));
  }
};

module.exports.addExperinces = async (req, res, next) => {
  try {
    const newExp = req.body;
    const profile = await Profile.findOne({ user: req.user.id });

    profile.experiences.unshift(newExp);

    const updatedProfile = await profile.save();
    res.status(200).json({
      status: "success",
      data: {
        profile: updatedProfile,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(400, error.message));
  }
};

module.exports.deleteExperiece = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.experiences
      .map((item) => item.id)
      .indexOf(req.params.expid);

    if (removeIndex >= 0) profile.experiences.splice(removeIndex, 1);
    else
      return next(new AppError(404, "Experiece with given ID was not found"));

    await profile.save();

    res.status(200).json({
      status: "success",
      data: {
        profile,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(500, "Something went wrong"));
  }
};

module.exports.addEducation = async (req, res, next) => {
  try {
    const newEdu = req.body;
    const profile = await Profile.findOne({ user: req.user.id });

    profile.education.unshift(newEdu);

    const updatedProfile = await profile.save();
    res.status(200).json({
      status: "success",
      data: {
        profile: updatedProfile,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(400, error.message));
  }
};

module.exports.deleteEducation = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.eduid);

    if (removeIndex >= 0) profile.education.splice(removeIndex, 1);
    else
      return next(new AppError(404, "Education with given ID was not found"));

    await profile.save();

    res.status(200).json({
      status: "success",
      data: {
        profile,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(500, "Something went wrong"));
  }
};

module.exports.getGetRepos = async (req, res, next) => {
  try {
    const result = await axios({
      method: "GET",
      url: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GIT_CLIENT_ID}&client_secret=${process.env.GIT_CLIENT_SECRET}`,
      headers: { "user-agent": "node.js" },
    });

    if (result.data.length <= 0) {
      return next(new AppError(500, "No github profile found"));
    }

    res.status(200).json({
      status: "success",
      data: {
        repos: result.data,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(500, "Something went wrong"));
  }
};
