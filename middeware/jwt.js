const jwt = require("jsonwebtoken");

const createAccessToken = (user_id, role) => {
  return jwt.sign({ id: user_id, role }, process.env.JWT_SECRET, {
    expiresIn: "5000s",
  });
};

module.exports = createAccessToken;
