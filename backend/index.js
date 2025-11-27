
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/mongodb");

const authRouter = require("./routes/authRoute");
const pollRouter = require("./routes/pollRoute");
const voteRouter = require("./routes/voteRoute");
const notificationRouter = require("./routes/notificationRoute");


const Poll = require("./models/pollModel");
const Notification = require("./models/notificationModel");
const User = require("./models/userModel");

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.get("/", (req, res) => res.send("Server Running ✔"));

app.use("/api/auth", authRouter);
app.use("/api/polls", pollRouter);
app.use("/api/vote", voteRouter);
app.use("/api/notifications", notificationRouter);

const AUTO_CLOSE_INTERVAL = 30 * 1000; 

setInterval(async () => {
  try {
    const now = new Date();
    const toClose = await Poll.find({ closed: false, endTime: { $lte: now } });
    for (const poll of toClose) {
      poll.closed = true;
      await poll.save();

      const totalVotes = poll.options.reduce((s, o) => s + (o.votes || 0), 0);
      const options = poll.options.map((o) => ({
        id: o._id,
        text: o.text,
        votes: o.votes || 0,
        percentage: totalVotes > 0 ? ((o.votes || 0) / totalVotes) * 100 : 0,
      }));


      let recipients = [];
      if (poll.visibility === "public") {
        const users = await User.find({}, "_id").lean();
        recipients = users.map((u) => u._id);
      } else {
        recipients = poll.allowedUsers || [];
      }

      if (!recipients.find((r) => r.toString() === poll.creator.toString())) {
        recipients.push(poll.creator);
      }

      const notifications = recipients.map((uId) => ({
        to: uId,
        title: `${poll.type === "vote" ? "Vote" : "Poll"} closed: ${poll.title || poll.question}`,
        description: `Total votes: ${totalVotes}. View results.`,
        pollId: poll._id,
        link: `/polls/${poll._id}/results`,
        meta: {
          startTime: poll.startTime,
          endTime: poll.endTime,
          creator: poll.creator,
        },
      }));
      if (notifications.length) await Notification.insertMany(notifications);
    }
  } catch (err) {
    console.error("Auto-close error:", err);
  }
}, AUTO_CLOSE_INTERVAL);

if (require.main === module) {
  app.listen(port, () => console.log("Server running on port", port));
}

module.exports = app;
