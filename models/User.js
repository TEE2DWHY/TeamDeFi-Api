const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide last name"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide phone number"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: [8, "Password length should be minimum of 8 characters"],
  },
});

module.exports = mongoose.model("User", userSchema);
