const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendEmail,
  resetPasswordMessage,
  verifyEmailMessage,
} = require("../utils/email");

//register new user
const register = asyncWrapper(async (req, res) => {
  const { password, confirmPassword, email } = req.body;
  if (password !== confirmPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please ensure password and confirm password values match",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const emailVerificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    });
    const user = await User.create({ ...req.body, password: hashedPassword });
    const firstName = user.fullName.split(" ")[0];
    await sendEmail({
      email: email,
      subject: "Welcome to Team Defi",
      message: verifyEmailMessage(emailVerificationToken),
    });
    res.status(StatusCodes.CREATED).json({
      msg: `account with name: ${firstName} is created successfully. Please check your email for verification.`,
      token: emailVerificationToken,
      // verification_url: `${process.env.BASE_URL}/api/v1/auth/verify-email?token=${emailVerificationToken}`,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred during account creation.",
    });
  }
});

// verify email after registration
const verifyEmail = asyncWrapper(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Missing verification token." });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const email = decodedToken.email;
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { isEmailVerified: true } }, // set isEmailVerified to true upon successful verification
      { new: true }
    );

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Invalid verification token." });
    }
    // Redirect the user to a success page or send a JSON response indicating successful verification.
    res.status(StatusCodes.OK).json({ msg: "Email verified successfully." });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid verification token." });
  }
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
  if (!user.isEmailVerified) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: `Please verify email before login`,
    });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
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

// forgot password
const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: `${email} does not exist`,
    });
  }
  try {
    const resetPasswordToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h", //  expiration time for the reset token
    });
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Set the expiration timestamp (1 hour from now in milliseconds)
    await user.save();
    await sendEmail({
      email: email,
      subject: "Reset Your Password",
      message: resetPasswordMessage(resetPasswordToken),
    });
    res.status(StatusCodes.OK).json({
      msg: `A reset password link has been sent to ${email}.`,
    });
  } catch (error) {
    console.error("Error sending reset password email:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while processing your request.",
    });
  }
});

// reset password
const resetPassword = asyncWrapper(async (req, res) => {
  const token = req.query.token;
  const { newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Token and newPassword fields are required.",
    });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      email: decodedToken.email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if the token is not expired
    });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid or expired reset token." });
    }
    // Update the user's password and remove the reset token fields
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: "Password reset successful." });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid reset token." });
  }
});

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
