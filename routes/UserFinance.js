const router = require("express").Router();
const UserFinances = require("../models/UserFinances");



router.post("/register", async (req, res) => {
    const newUser = new UserFinances({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phonenumber: req.body.phonenumber,
        email: req.body.email,
        info: req.body.info
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