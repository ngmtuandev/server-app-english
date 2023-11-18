const jwt = require("jsonwebtoken");
const asyncHandle = require("express-async-handler");

const verifyAccessToken = asyncHandle(async (req, res, next) => {
  if (req?.headers?.author?.startsWith("Bearer")) {
    const token = req?.headers?.author.split(" ")[1];
    // console.log(token);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).json({
          status: -1,
          mess: " Xác nhậc token lỗi",
        });
      }
      req.auth = decode;
      next();
    });
  } else {
    return res.status(401).json({
      status: -1,
      mess: "Xác nhậc token lỗi",
    });
  }
});

module.exports = verifyAccessToken;
