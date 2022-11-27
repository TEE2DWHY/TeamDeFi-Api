const router = require("express").Router();
const UserFinance = require("../models/UserFinances");


router.post("/register", async (req, res) => {
    const newUser = new UserFinance({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
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