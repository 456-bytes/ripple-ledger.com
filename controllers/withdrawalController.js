import Withdrawal from "../models/withdrawal.js";
import User from "../models/user.js";
import { sendMail } from "../utils/mailer.js"; // your mailer engine
import withdrawalStatusTemplate from "../emailTemplates/withdrawalStatusTemplate.js"; // email HTML template

// 👇 Add this here
console.log("withdrawalStatusTemplate type:", typeof withdrawalStatusTemplate);

// User requests a withdrawal
export const createWithdrawal = async (req, res) => {
  try {
    const { method, address, amount } = req.body;

    // 👇 Get the logged-in user (set by requireAuth middleware)
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Validate balance
    if (amount > user.wallet) {
      return res.status(400).json({ success: false, message: "Insufficient funds" });
    }

    // Deduct funds temporarily
    user.wallet -= amount;
    user.fundswithdraw = (user.fundswithdraw || 0) + amount;
    await user.save();

    // Create withdrawal record
    const withdrawal = new Withdrawal({
      userId: user._id,
      method,
      address,
      amount,
      status: "pending",
    });
    await withdrawal.save();

    // Send email to user notifying pending withdrawal
    try {
      await sendMail({
        to: user.email,
        subject: "Withdrawal Submitted - Ripple-Ledger",
        html: withdrawalStatusTemplate({
            name: user.username,
            amount: withdrawal.amount, // make sure it's coming from the withdrawal object
            status: withdrawal.status   // or "pending" if you set it manually
          }),
      });
    } catch (err) {
      console.error("approveWithdrawal email failed:", err.message);
    }

    res.json({ success: true, message: "Withdrawal request submitted", withdrawal });
  } catch (err) {
    console.error("createWithdrawal error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin approves or rejects a withdrawal
export const approveWithdrawal = async (req, res) => {
    try {
      const { withdrawalId, status } = req.body; // status: 'approved' or 'rejected'
  
      const withdrawal = await Withdrawal.findById(withdrawalId);
      if (!withdrawal) {
        return res.status(404).json({ success: false, message: "Withdrawal not found" });
      }
  
      const user = await User.findById(withdrawal.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    // Update withdrawal status
    withdrawal.status = status;
    await withdrawal.save();

    // If rejected, refund user
    if (status === "rejected") {
      user.wallet += withdrawal.amount;
      user.fundswithdraw -= withdrawal.amount;
      await user.save();
    }

    // Send email notifying status update
    try {
        await sendMail({
          to: user.email,
          subject: `Withdrawal ${status} - Ripple-Ledger`,
          html: withdrawalStatusTemplate({
            name: user.username,
            amount: withdrawal.amount,
            status
          }),
        });
      } catch (emailErr) {
        console.error("❌ approveWithdrawal email error:", emailErr.message);
      }
  
      res.json({ success: true, message: `Withdrawal ${status} successfully`, withdrawal });
    } catch (err) {
      console.error("❌ approveWithdrawal error:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export default {
    createWithdrawal,
    approveWithdrawal,
  };
  