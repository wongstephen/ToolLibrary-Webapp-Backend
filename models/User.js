const mongoose = require("../db/connection");
const Schema = mongoose.Schema;
const ToolSchema = require("./Tool");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    tool: [ToolSchema],
  },
  {
    timestamps: true,
    toJSON: {
      //Prevents password return to user.
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
