const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const CONSTANTS = require("../config/constants");

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  logger.info(req.cookies);
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, CONSTANTS.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
