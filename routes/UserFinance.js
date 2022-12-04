const router = require("express").Router();
const UserFinances = require("../models/UserFinances");



router.post("/register", async (req, res) => {
    const newUser = new UserFinances({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
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