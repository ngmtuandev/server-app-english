const mongoose = require("mongoose");

const postChema = new mongoose.Schema(
  {
    text: {
      type: String,
      require: true,
    },
    likes: {
      type: Array,
    },
    location: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    img: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postChema);
