const router = require("express").Router();

const { signup } = require("../controllers/auth")


router.post("/register", signup);

module.exports = router