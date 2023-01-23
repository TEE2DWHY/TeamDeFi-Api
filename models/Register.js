const mongoose = require("mongoose")
const validator = require('validator')

const RegisterSchema = new mongoose.Schema({
    fullName: { type: String, require: true, },
    email: { type: String, require: true, unique: true },
    phoneNumber: { type: String, require: true, unique: true },
    password: { type: String, require: true, minLength: 8 },
    confirmPassword: {
        type: String,
        require: true,
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: "password mismatch"
        }
    },
    terms: { type: Boolean, require: true }
})


module.exports = mongoose.model("registeredUsers", RegisterSchema)