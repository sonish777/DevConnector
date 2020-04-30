const express = require("express");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/AppError");
const errorController = require("./controllers/errorController");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const postRoutes = require("./routes/postRoutes");
const viewRoutes = require("./routes/viewRoutes");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "pug");

app.use(express.json());
// app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(express.static(`${__dirname}/public`));

app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/", viewRoutes);

app.all("*", (req, res, next) => {
  console.log(req.url);
  return next(new AppError(404, "The route was not found !"));
});

app.use(errorController.errorHandler);

module.exports = app;
