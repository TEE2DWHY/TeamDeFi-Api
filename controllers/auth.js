const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcrypt");
//register new user
const register = asyncWrapper(async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please ensure password and confirm password values match",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ ...req.body, password: hashedPassword });
  res.status(StatusCodes.CREATED).json({
    msg: `user: ${user.firstName} is created successfully.`,
  });
});

//login new user
const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Invalid Credentials",
    });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Invalid Credentials",
    });
  }
  res.status(StatusCodes.OK).json({
    msg: "Login is Successful",
  });
});

module.exports = { register, login };
