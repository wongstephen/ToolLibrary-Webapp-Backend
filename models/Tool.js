const mongoose = require("../db/connection");

const ToolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    photo: {
      type: String,
    },
    loanee: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    // prevents password return to user.
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

module.exports = ToolSchema;
