const crypto = require("crypto");
const Invite = require("../models/invite");
const User = require("../models/user");

function sha256(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

exports.createInvite = async (req, res) => {
  try {
    const { expiresInHours, maxUses } = req.body;

    const admin = req.user; // assuming you have admin auth middleware
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const rawToken = crypto.randomBytes(24).toString("hex");
    const tokenHash = sha256(rawToken);
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    const invite = await Invite.create({
      tokenHash,
      createdBy: admin._id,
      maxUses,
      expiresAt,
    });

    const fullUrl = `${req.protocol}://${req.get("host")}/signup?invite=${rawToken}`;

    res.status(201).json({
      success: true,
      message: "Invite created successfully",
      inviteLink: fullUrl,
      expiresAt,
      maxUses,
    });
  } catch (err) {
    console.error("createInvite error", err);
    res.status(500).json({ message: "Server error creating invite" });
  }
};
