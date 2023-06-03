const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

//register new user
const register = (req, res) => {
  res.status(StatusCodes.CREATED).json({
    msg: "user registered successfully",
  });
};

//login new user
const login = (req, res) => {
  res.status(StatusCodes.OK).json({
    msg: "login is successful",
  });
};

module.exports = { register, login };
