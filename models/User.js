const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please provide name"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide phone number"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: [8, "Password length should be minimum of 8 characters"],
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
