const router = require("express").Router();
const UserFinances = require("../models/Users");



router.post("/register", async (req, res) => {
    const newUser = new UserFinances({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        details: req.body.details
    })

    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    }
    catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router