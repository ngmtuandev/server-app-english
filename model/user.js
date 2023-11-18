const mongoose = require("mongoose");

const userChema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      min: 5,
    },
    lastName: {
      type: String,
      require: true,
      min: 5,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    listVoca: {
      type: mongoose.Types.ObjectId,
      ref: "Vocabulary",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChanfe: {
      type: String,
    },
    tokenResetPassword: {
      type: String,
    },
    tokenExpirePassword: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userChema);
