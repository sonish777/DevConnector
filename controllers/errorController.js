module.exports.errorHandler = (err, req, res, next) => {
  // console.log("INSIDE ERROR HANDLER \n\n");
  // console.log(err);
  // console.log(req.originalUrl);
  console.log("FROM ERROR HANDLER", err);
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  if (req.originalUrl.startsWith("/api")) {
    return res.status(statusCode).json({
      status: status,
      message: err.message,
    });
  } else if (req.originalUrl.startsWith("/")) {
    return res.status(statusCode).render("errorPage", {
      statusCode,
      message: err.message,
    });
  }
};
