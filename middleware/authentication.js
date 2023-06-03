const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const authentication = async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken || authToken.startsWith("Bearer")) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Authorization Failed",
    });
    const token = authToken.split(" ")[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      //   const { userId } = payload;
      req.user.userId = payload.userId;
    } catch (err) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Unauthorized User",
      });
    }
  }
};

module.exports = authentication;
