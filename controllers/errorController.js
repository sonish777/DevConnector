module.exports.errorHandler = (err, req, res, next) => {
  console.log("INSIDE ERROR HANDLER \n\n");
  console.log(err);
  console.log(req.originalUrl);
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  res.status(statusCode).json({
    status: status,
    message: err.message,
  });
};
