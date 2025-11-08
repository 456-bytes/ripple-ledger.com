// controllers/adminController.js
const User = require('../models/user');
// const mongoose = require("mongoose");
const Invite = require('../models/invite');
const crypto = require('crypto');
const { sendMail, withdrawalStatusTemplate } = require("../utils/mailer");

// ⚠️ Safe stub if Withdrawal model missing
let Withdrawal;
try {
  Withdrawal = require('../models/withdrawal');
} catch (e) {
  console.warn("⚠️ No Withdrawal model found. Using stub.");
  Withdrawal = {
    find: async () => [],
    findByIdAndUpdate: async (id, update) => ({ _id: id, ...update })
  };
}

/* ---------------- USERS ---------------- */
async function getUsers(req, res) {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function userOverview(req, res) {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function adjustField(req, res) {
  try {
    let { field, amount } = req.body;

    const allowed = [
      "wallet",
      "profit",
      "fundswithdraw",
      "airdrop",
      "airprofit",
      "airwithdraw"
    ];
    if (!allowed.includes(field))
      return res.status(400).json({ success: false, message: "Invalid field" });

    amount = Number(String(amount).replace(/,/g, ""));
    if (isNaN(amount))
      return res.status(400).json({ success: false, message: "Invalid amount" });

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    user[field] = (user[field] || 0) + amount;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: `${field} updated`, value: user[field] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/* ---------------- WITHDRAWALS ---------------- */
async function getWithdrawals(req, res) {
  try {
    const withdrawals = await Withdrawal.find();
    res.json({ success: true, withdrawals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function approveWithdrawal(req, res) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const withdrawal = await Withdrawal.findById(id).populate("userId");
    if (!withdrawal)
      return res.status(404).json({ success: false, message: "Withdrawal not found" });

    if (withdrawal.status !== "pending")
      return res.status(400).json({ success: false, message: "Already processed" });

    const user = await User.findById(withdrawal.userId._id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (status === "approved") {
      user.wallet = (user.wallet || 0) - withdrawal.amount;
      user.fundswithdraw = (user.fundswithdraw || 0) + withdrawal.amount;
      withdrawal.status = "approved";
    } else {
      user.wallet = (user.wallet || 0) + withdrawal.amount;
      withdrawal.status = "rejected";
    }

    await user.save();
    await withdrawal.save();

    const html = withdrawalStatusTemplate({
      status,
      amount: withdrawal.amount,
      method: withdrawal.method,
      address: withdrawal.address,
      note,
    });

    await sendMail({
      to: user.email,
      subject: "Withdrawal Update",
      html,
    });

    res.json({ success: true, message: `Withdrawal ${status}`, withdrawal });
  } catch (err) {
    console.error("approveWithdrawal error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}

/* ---------------- INVITES ---------------- */
function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

async function createInvite(req, res) {
  try {
    const { maxUses = 1, expiresInDays = 7, notes = '' } = req.body;
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    const rawToken = crypto.randomBytes(20).toString('hex');
    const tokenHash = sha256(rawToken);

    // ✅ Ensure req.user exists
    if (!req.user && req.userId) {
      req.user = await User.findById(req.userId);
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: admin user missing' });
    }

    const invite = await Invite.create({
      tokenHash,
      createdBy: req.user._id,
      maxUses,
      expiresAt,
      notes,
    });

    const inviteLink = `${req.protocol}://${req.get('host')}/signup?token=${rawToken}`;

    res.status(201).json({
      message: 'Invite created successfully',
      inviteLink,
      expiresAt,
      maxUses,
    });
  } catch (err) {
    console.error('createInvite error', err);
    res.status(500).json({ message: 'Server error creating invite' });
  }
}

async function listInvites(req, res) {
  try {
    const invites = await Invite.find()
      .populate('createdBy', 'email username')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ ok: true, invites });
  } catch (e) {
    console.error('listInvites error', e);
    res.status(500).json({ ok: false, message: 'Failed to list invites' });
  }
}

async function revokeInvite(req, res) {
  try {
    const { id } = req.params;
    const invite = await Invite.findByIdAndUpdate(id, { disabled: true }, { new: true });
    if (!invite) return res.status(404).json({ ok: false, message: 'Invite not found' });
    res.status(200).json({ ok: true, invite });
  } catch (e) {
    console.error('revokeInvite error', e);
    res.status(500).json({ ok: false, message: 'Failed to revoke invite' });
  }
}

/* ---------------- EXPORTS ---------------- */
module.exports = {
  getUsers,
  userOverview,
  adjustField,
  deleteUser,
  getWithdrawals,
  approveWithdrawal,
  createInvite,
  listInvites,
  revokeInvite
};
