const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    phoneNumber: { type: String, require: true, unique: true },
    details: { type: String }
})

module.exports = mongoose.model("Users", userSchema)