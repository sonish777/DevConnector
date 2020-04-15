const User = require("../models/User");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const createJWTToken = require("../utils/createJwtToken");

module.exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    if (user) {
      const token = createJWTToken(user.id, res);

      if (!token) {
        return next(new Error("Token could not be created"));
      }
      res.status(200).json({
        status: "success",
        data: {
          user,
          token,
        },
      });
    }
  } catch (error) {
    // const errValues = Object.values(error.errors);
    // const messages = errValues.map((el) => el.message);
    return next(new AppError(400, error.message));
  }
};
