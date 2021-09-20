const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const post = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    rate: { type: Number, default: 3 },
    img: { type: String, required: true },
    reservations: [
      {
        reservedBy: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
      },
    ],
    feedback: [
      {
        user: {
          type: mongoose.ObjectId,
          ref: "user",
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],
    by: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Post = mongoose.model("post", post);
module.exports = Post;
