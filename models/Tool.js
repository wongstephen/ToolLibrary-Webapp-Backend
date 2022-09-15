const mongoose = require("../db/connection");
const Schema = mongoose.Schema;

const ToolSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
    },
    loanee: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
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
