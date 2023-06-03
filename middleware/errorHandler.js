const { StatusCodes } = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
  //validation error
  if (err.name === "ValidationError") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: `${err.message}`,
    });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    msg: `${err.message}`,
  });
};

module.exports = errorHandler;
