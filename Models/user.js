const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
    isSeller: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    avatar: { type: String, default: "avatar" },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("user", user);
module.exports = User;
