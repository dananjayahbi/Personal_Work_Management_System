const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newIdea = new Schema(
  {
    idea: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Ideas = mongoose.model("Ideas", newIdea);

module.exports = Ideas;