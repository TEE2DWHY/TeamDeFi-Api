const { StatusCodes } = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
  //validation error
  if (err.name === "ValidationError") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: err.message,
    });
  }
  //duplicate key
  if (err.code === 11000) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: `${Object.keys(err.keyValue)} is taken. Please try another.`,
    });
  }
  //cast error
  if (err.name === "castError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: `{err.value} does not exist in database`,
    });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    msg: err.message,
  });
};

module.exports = errorHandler;
