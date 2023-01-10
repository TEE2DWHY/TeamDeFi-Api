const mongoose = require("mongoose")
const validator = require('validator')

const RegisterSchema = new mongoose.Schema({
    fullName: { type: String, require: true, unique: true },
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


// RegisterSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     this.password = await bcrypt.hash(this.password, 12);
//     this.passwordConfirm = undefined;
//     next();
// });

module.exports = mongoose.model("registeredUsers", RegisterSchema)