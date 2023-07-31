const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

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
  const firstName = user.fullName.split(" ")[0];
  res.status(StatusCodes.CREATED).json({
    msg: `user: ${firstName} is created successfully.`,
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
  const passwordMatch = bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Invalid Credentials",
    });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  const firstName = user.fullName.split(" ")[0];
  res.status(StatusCodes.OK).json({
    firstName: firstName,
    token: token,
  });
});

//forgot password
const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: `${email} does not exist`,
      });
    }
    await sendEmail({
      email: email,
      subject: "Confirm Email Address",
      message: "Confirm email address by using this Link",
    });

    res.status(StatusCodes.OK).json({
      msg: "reset password mail successfully sent",
    });
  } catch (err) {
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   error: "An error occurred while sending the email.",
    // });
    console.log(err);
  }
});

module.exports = { register, login, forgotPassword };
