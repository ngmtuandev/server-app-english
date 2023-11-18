const jwt = require("jsonwebtoken");
const createRefreshToken = (user_id) => {
  return jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
    expiresIn: "120s",
  });
};

module.exports = createRefreshToken;
