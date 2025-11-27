
const Poll = require("../models/pollModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

exports.createPoll = async (req, res) => {
  try {
    const data = req.body;

    if (!data.question && !data.title) return res.status(400).json({ success: false, message: "Question or title is required" });
    if (!data.options || !Array.isArray(data.options) || data.options.length < 2) {
      return res.status(400).json({ success: false, message: "At least two options are required" });
    }

    let allowedUsers = [];
    if (data.allowedUsers && data.allowedUsers.length) {

      const maybeEmails = data.allowedUsers.filter(a => typeof a === "string" && a.includes("@"));
      if (maybeEmails.length) {
        const users = await User.find({ email: { $in: maybeEmails } });
        allowedUsers = users.map(u => u._id);
      } else {
        allowedUsers = data.allowedUsers.map(id => mongoose.Types.ObjectId(id));
      }
    }

    const poll = new Poll({
      type: data.type || "poll",
      creator: req.user.id,
      question: data.question,
      title: data.title,
      options: data.options.map(op => ({ text: op })),
      multiple: data.type === "multiple",
      anonymous: data.anonymous || false,
      visibility: data.visibility || "public",
      allowedUsers: allowedUsers,
      startTime: data.start ? new Date(data.start) : new Date(),
      endTime: data.end ? new Date(data.end) : new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await poll.save();


    let recipients = [];
    if (poll.visibility === "public") {
      const users = await User.find({}, "_id").lean();
      recipients = users.map(u => u._id);
    } else {
      recipients = poll.allowedUsers || [];
    }
    if (!recipients.find(r => r.toString() === poll.creator.toString())) recipients.push(poll.creator);

    const notifications = recipients.map(uid => ({
      to: uid,
      title: `New ${poll.type === "vote" ? "Vote" : "Poll"}: ${poll.title || poll.question}`,
      description: `Starts: ${poll.startTime}. Ends: ${poll.endTime}`,
      pollId: poll._id,
      link: `/polls/${poll._id}`,
      meta: { startTime: poll.startTime, endTime: poll.endTime, creator: poll.creator },
    }));
    if (notifications.length) await Notification.insertMany(notifications);

    return res.json({ success: true, id: poll._id, message: "Poll created" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

exports.getMyPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ creator: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, polls });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

exports.getAvailablePolls = async (req, res) => {
  try {

    const userId = req.user.id;
    const polls = await Poll.find({
      $or: [{ visibility: "public" }, { allowedUsers: userId }],
      closed: false,
    }).sort({ createdAt: -1 });
    res.json({ success: true, polls });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).lean();
    if (!poll) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, poll });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
