const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token;
  try {
    token = req.headers.authorization;
    const decoded = jwt.verify(token, "Secret");
    console.log(decoded);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      Message: "Auth Failed",
      token: token,
    });
  }
};
