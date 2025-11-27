
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async function (req, res, next) {
  try {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = { id: user._id, email: user.email, name: user.name };
    next();
  } catch (err) {
    console.error("auth error", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
