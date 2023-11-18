const jwt = require("jsonwebtoken");
const asyncHandle = require("express-async-handler");

const verifyAdmin = asyncHandle(async (req, res, next) => {
  const { role } = req.auth;
  if (role && req.auth) {
    if (role !== "admin") {
      res.status(401).json({
        status: 1,
        mess: "Người dùng phải là admin",
      });
    }
    next();
  }
});
module.exports = verifyAdmin;
