const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "../config.env" });

const createJWTToken = (id, res) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: 24 * 60 * 60 * 1000,
  });
  console.log("Token is ", token);
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  return token;
};

module.exports = createJWTToken;
