

const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question: String,
    options: [
        {
            text: String
        }
    ],
    responses: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            optionId: { type: mongoose.Schema.Types.ObjectId }
        }
    ],
    multiple: Boolean,
    anonymous: Boolean,
    visibility: String,
    allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    startTime: Date,
    endTime: Date,
    closed: { type: Boolean, default: false }
});

module.exports = mongoose.model("Poll", pollSchema);
