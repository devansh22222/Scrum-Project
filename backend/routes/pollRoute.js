
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const pollController = require("../controllers/pollController");

// POST create poll
router.post("/create", auth, pollController.createPoll);
// GET my polls
router.get("/mine", auth, pollController.getMyPolls);
// GET available polls for user
router.get("/available", auth, pollController.getAvailablePolls);
// GET poll by id
router.get("/:id", auth, pollController.getPollById);

// GET ALL PUBLIC + ALLOWED POLLS
router.get("/all", auth, async (req, res) => {
    try {
        const polls = await Poll.find({
            $or: [
                { visibility: "public" },
                { allowedUsers: req.user.id }
            ]
        }).populate("creator", "name email");

        res.json({ success: true, polls });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});
// GET POLL RESULTS
router.get("/:pollId/results", auth, async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.pollId)
            .populate("creator", "name")
            .populate("responses.user", "name email");

        if (!poll) return res.json({ success: false, message: "Not found" });

        const totalVotes = poll.responses.length;

        const results = poll.options.map(op => {
            const count = poll.responses.filter(r => r.optionId.toString() === op._id.toString()).length;

            return {
                option: op.text,
                votes: count,
                percentage: totalVotes ? (count / totalVotes) * 100 : 0,
                users: poll.responses
                    .filter(r => r.optionId.toString() === op._id.toString())
                    .map(u => ({
                        name: u.user.name,
                        email: u.user.email
                    }))
            };
        });

        res.json({
            success: true,
            poll: {
                question: poll.question,
                creator: poll.creator.name,
                totalVotes
            },
            results
        });

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});



module.exports = router;
