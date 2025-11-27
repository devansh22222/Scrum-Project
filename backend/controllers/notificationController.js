
const Notification = require("../models/notificationModel");

exports.getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({ to: req.user.id }).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ success: true, notifications: notifs });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
