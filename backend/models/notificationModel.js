
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll" },
  link: String,
  meta: {},
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
