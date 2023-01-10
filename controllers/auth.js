const cryptoJS = require('crypto-js');
const Register = require('../models/Register');


const signup = async (req, res, next) => {
    const newUser = new Register({
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: cryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
        confirmPassword: this.password,
        terms: req.body.terms
    })
    try {
        const savedUser = await newUser.save()
        res.status(200).json({ savedUser, message: "successful" })
    }
    catch (err) {
        res.status(500).json(err)
    }
}


module.exports = {
    signup
}