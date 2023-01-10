const router = require("express").Router();
const Register = require("../models/Register")


router.post("/register", async (req, res) => {
    const newUser = new Register({
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        terms: req.body.terms
    })
    try {
        const savedUser = await newUser.save()
        res.status(200).json({ savedUser, message: "successful" })
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router