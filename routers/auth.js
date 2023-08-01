const router = require("express").Router();
const {
  register,
  login,
  forgotPassword,
  verifyEmail,
} = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-email").get(verifyEmail);

module.exports = router;
