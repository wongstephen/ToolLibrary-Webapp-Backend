const mongoose = require("../db/connection");
const Schema = mongoose.Schema;


const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
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

module.exports = mongoose.model("User", UserSchema);
