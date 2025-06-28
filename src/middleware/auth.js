// middleware/auth.js
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded; // 👈 store user info in request
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

module.exports = authenticate;
