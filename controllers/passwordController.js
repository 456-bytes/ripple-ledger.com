import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

import User from "../models/user.js";
import { sendMail, resetEmailTemplate } from "../utils/mailer.js";

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Serve forgot_password.html
 */
export function forgotPassword_get(req, res) {
  res.sendFile(path.join(__dirname, "../views/forgot_password.html"));
}

/**
 * Handle forgot password form submission
 */
export async function forgotPassword_post(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.send(`<p style="color:red;text-align:center;">Email field is required.</p>`);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.send(`<p style="color:red;text-align:center;">No account found with that email.</p>`);
    }

    // Generate raw reset token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Construct reset link with /api/auth prefix
    const resetLink = `${req.protocol}://${req.get("host")}/api/auth/reset_password/${token}`;

    // Send reset email
    await sendMail({
      to: user.email,
      subject: "Reset Your Password",
      html: resetEmailTemplate({
        name: user.username || user.email,
        link: resetLink,
      }),
    });

    return res.send(`<p style="color:green;text-align:center;">
      We've sent a secure password reset link to your registered email address.<br>
      Please check your inbox and follow the instructions.
    </p>`);
  } catch (err) {
    console.error("Forgot password error:", err);
    res.send(`<p style="color:red;text-align:center;">Something went wrong. Please try again later.</p>`);
  }
}

/**
 * Serve reset_password.html if token is valid
 */
export async function resetPassword_get(req, res) {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token, // raw token
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      // Invalid or expired token → serve error page
      return res.sendFile(path.join(__dirname, "../views/invalid_token.html"));
    }

    res.sendFile(path.join(__dirname, "../views/reset_password.html"));
  } catch (err) {
    console.error("Reset password GET error:", err);
    res.send(`<p style="color:red;text-align:center;">Server error. Please try again later.</p>`);
  }
}

/**
 * Handle password reset submission via form POST
 * Display normal HTML messages instead of JSON
 */
export async function resetPassword_post(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!password || password.length < 6) {
      return res.send(`<p style="color:red;text-align:center;">Password must be at least 6 characters long.</p>`);
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.send(`<p style="color:red;text-align:center;">Invalid or expired reset link.</p>`);
    }

    // Update password (pre-save hook hashes automatically)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Success message and redirect link
    return res.send(`<p style="color:green;text-align:center;">
      Password reset successful! <a href="/login">Click here to login</a>.
    </p>`);
  } catch (err) {
    console.error("Reset password POST error:", err);
    res.send(`<p style="color:red;text-align:center;">Something went wrong. Try again later.</p>`);
  }
}

/**
 * Export controller functions
 */
export default {
  forgotPassword_get,
  forgotPassword_post,
  resetPassword_get,
  resetPassword_post,
};
