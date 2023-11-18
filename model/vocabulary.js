const mongoose = require("mongoose");

const vocabularyChema = new mongoose.Schema(
  {
    eng: {
      type: String,
      require: true,
    },
    vie: {
      type: String,
      require: true,
    },
    progress: {
      type: Number,
      default: 1
    },
    status: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
    },
    example: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vocabulary", vocabularyChema);
