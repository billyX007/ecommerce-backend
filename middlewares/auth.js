const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send({ error: "Access denied. No token provided" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = payload;
    next();
  } catch (error) {
    res.status(400).send({ error: "Invalid token" });
  }
}

module.exports = auth;
