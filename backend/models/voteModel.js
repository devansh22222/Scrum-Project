const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: String,
  desc: String,
  photo: String,
  votes: { type: Number, default: 0 },
});

const voteSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  candidates: [candidateSchema],
  multiple: { type: Boolean, default: false },
  visibility: { type: String, enum: ["public", "selected"], default: "public" },
  allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  startTime: Date,
  endTime: Date,
  closed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Vote", voteSchema);
