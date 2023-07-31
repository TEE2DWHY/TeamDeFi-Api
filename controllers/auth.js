const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail, message } = require("../utils/email");

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
      message: message(emailVerificationToken),
    });
    res.status(StatusCodes.CREATED).json({
      msg: `account with name: ${firstName} is created successfully. Please check your email for verification.`,
      token: emailVerificationToken,
      url: `${process.env.BASE_URL}/api/v1/auth/verify-email?token=${emailVerificationToken}`,
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
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify the JWT using your JWT secret
    const email = decodedToken.email;
    console.log(email);

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
  // check if user is verified
  if (user.isEmailVerified === false) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: `Please verify email before login`,
    });
  }
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
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: `${email} does not exist`,
    });
  }
  await sendEmail({
    email: email,
    subject: "Confirm Email Address",
    message: message(),
  });

  res.status(StatusCodes.OK).json({
    msg: `email sent to ${email}`,
  });
});

module.exports = { register, login, verifyEmail, forgotPassword };
