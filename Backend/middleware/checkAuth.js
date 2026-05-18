const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authorization failed.");
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message:
            "Authorization failed. Probably your login session got expired.  Please try logging out and logging in back.",
          error: err,
        });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Authorization failed",
      error: err,
    });
  }
};
