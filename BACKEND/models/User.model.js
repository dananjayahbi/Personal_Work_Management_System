const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newUser = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      requied: true,
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", newUser);

module.exports = User;
