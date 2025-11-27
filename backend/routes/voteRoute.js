
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const voteController = require("../controllers/voteController");

router.post("/:pollId/submit", auth, voteController.submitVote);
router.get("/:pollId/results", auth, voteController.getResults);

module.exports = router;
