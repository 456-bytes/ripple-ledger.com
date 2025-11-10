import crypto from "crypto";
import Invite from "../models/invite.js";
import User from "../models/user.js";

function sha256(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export const createInvite = async (req, res) => {
  try {
    const { expiresInHours = 24, maxUses = 1 } = req.body;

    const admin = req.user; // assuming admin is attached by auth middleware
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ Generate secure token & hash
    const rawToken = crypto.randomBytes(24).toString("hex");
    const hashedToken = sha256(rawToken);

    // ✅ Expiration date
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    // ✅ Create invite (use `token`, not `tokenHash`)
    const invite = await Invite.create({
      token: hashedToken,
      createdBy: admin._id,
      maxUses,
      expiresAt,
    });

    // ✅ The link you send to user (raw token)
    const fullUrl = `${req.protocol}://${req.get("host")}/signup?token=${rawToken}`;

    return res.status(201).json({
      success: true,
      message: "Invite created successfully",
      inviteLink: fullUrl,
      expiresAt,
      maxUses,
    });
  } catch (err) {
    console.error("createInvite error:", err);
    return res.status(500).json({ message: "Server error creating invite" });
  }
};
