
const Poll = require("../models/pollModel");
const Notification = require("../models/notificationModel");
const mongoose = require("mongoose");

exports.submitVote = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { choices } = req.body; // array of option indices or option ids

    if (!choices || !Array.isArray(choices) || choices.length === 0) {
      return res.status(400).json({ success: false, message: "Please choose at least one option" });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ success: false, message: "Poll not found" });

    const now = new Date();
    if (now < new Date(poll.startTime)) return res.status(400).json({ success: false, message: "Voting hasn't started yet" });
    if (now > new Date(poll.endTime) || poll.closed) return res.status(400).json({ success: false, message: "Voting closed" });

    // check access
    if (poll.visibility === "selected") {
      const allowed = poll.allowedUsers.map(String);
      if (!allowed.includes(String(req.user.id))) return res.status(403).json({ success: false, message: "You are not allowed to vote" });
    }

    const userAlreadyVoted = poll.options.some(o => o.voters?.some(v => String(v) === String(req.user.id)));
    if (userAlreadyVoted) return res.status(400).json({ success: false, message: "You already voted" });


    if (!poll.multiple && choices.length > 1) return res.status(400).json({ success: false, message: "Only single choice allowed" });


    for (const choice of choices) {
      let opt;
      if (mongoose.Types.ObjectId.isValid(choice)) {
        opt = poll.options.id(choice);
      } else {
        // treat as index
        const idx = Number(choice);
        opt = poll.options[idx];
      }
      if (!opt) {
        return res.status(400).json({ success: false, message: "Invalid option chosen" });
      }
      opt.votes = (opt.votes || 0) + 1;
      opt.voters = opt.voters || [];
      opt.voters.push(req.user.id);
    }

    await poll.save();

 
    await Notification.create({
      to: poll.creator,
      title: `New vote on: ${poll.title || poll.question}`,
      description: `${req.user.name || req.user.email} voted`,
      pollId: poll._id,
      link: `/polls/${poll._id}/results`,
    });

    return res.json({ success: true, message: "Vote recorded" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId).populate("creator", "name email").lean();
    if (!poll) return res.status(404).json({ success: false, message: "Not found" });

    const totalVotes = poll.options.reduce((s, o) => s + (o.votes || 0), 0);
    const options = poll.options.map(o => ({
      id: o._id,
      text: o.text,
      votes: o.votes || 0,
      percentage: totalVotes > 0 ? ((o.votes || 0) / totalVotes) * 100 : 0,
      voters: poll.anonymous ? undefined : (o.voters || []),
    }));

    res.json({ success: true, totalVotes, options, creator: poll.creator });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
