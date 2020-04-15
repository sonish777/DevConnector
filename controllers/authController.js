const dotenv = require("dotenv");
const AppError = require("./../utils/AppError");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const createJWTToken = require("../utils/createJwtToken");

dotenv.config({ path: "./../config.env" });

module.exports.protectRoute = async (req, res, next) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token === "") {
    return next(new AppError(401, "You are not logged in. Please login first"));
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

  try {
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return next(new AppError(404, "User for bearer token not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError(500, error.message));
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError(400, "Please enter email and password"));
  }

  try {
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      return next(new AppError(401, "Invalid Credentials"));
    }

    const match = await user.isPasswordCorrect(password);
    if (!match) {
      return next(new AppError(401, "Invalid Credentials"));
    }

    const token = createJWTToken(user.id, res);

    if (!token) {
      return next(new AppError(500, "Token could not be created"));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(500, error.message));
  }
};

module.exports.isLoggedIn = async (req, res, next) => {
  let token = "";
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (token == "") {
    return next();
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next();
  }

  res.locals.user = user;
  next();
};

module.exports.logOut = async (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.locals.user = undefined;

  res.status(200).json({
    status: "success",
    message: "Logged Out",
  });
};
