const router = require("express").Router();
const { register, login, forgotPassword } = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.post("/forgot-password", forgotPassword);

module.exports = router;
