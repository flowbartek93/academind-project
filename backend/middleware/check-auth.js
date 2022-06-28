const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1];

    console.log(token);
    jwt.verify(token, "longer");

    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};
