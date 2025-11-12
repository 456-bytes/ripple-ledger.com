// controllers/authController.js
import User from "../models/user.js";
import VerificationToken from "../models/verificationToken.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Invite from "../models/invite.js";
import generateOTP from "../utils/otp.js";
import {
  sendMail,
  welcomeEmailTemplate,
  verificationEmailTemplate
} from "../utils/mailer.js";

// Utility: hash helper
function sha256(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

// ---------------- ERROR HANDLER ----------------
const handleErrors = (err) => {
  console.log("handleErrors:", err && err.message, err && err.code);
  let errors = { username: "", email: "", password: "" };

  if (err.message === "incorrect email") errors.email = "This email is not registered";
  if (err.message === "incorrect password") errors.password = "This password is incorrect";

  if (err.code === 11000) {
    errors.email = "This email is already registered";
    return errors;
  }

  if (err.message && err.message.includes && err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// ---------------- JWT CREATOR ----------------
const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "3d" });

// ---------------- ROUTE CONTROLLERS ----------------
export const login_get = (req, res) => res.render("login");

export const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

// ---------------- SIGNUP (invite-only) ----------------
export const signup_get = async (req, res) => {
  try {
    const { invite } = req.query;

    if (!invite) {
      return res.render("signup", {
        inviteRequired: true,
        inviteToken: null,
        errorMessage: null,
      });
    }

    const tokenHash = sha256(invite);
    const inviteDoc = await Invite.findOne({ tokenHash, disabled: false }).lean();

    const now = new Date();
    const valid = inviteDoc && inviteDoc.uses < inviteDoc.maxUses && inviteDoc.expiresAt > now;

    if (!valid) {
      return res.render("signup", {
        inviteRequired: true,
        inviteToken: null,
        errorMessage: "⚠️ This access link is invalid, used up, or expired.",
      });
    }

    return res.render("signup", {
      inviteRequired: false,
      inviteToken: invite,
      errorMessage: null,
    });
  } catch (e) {
    console.error("signup_get error", e);
    return res.render("signup", {
      inviteRequired: true,
      inviteToken: null,
      errorMessage: "⚠️ Server error validating access link.",
    });
  }
};

export const signup_post = async (req, res) => {
  try {
    const { username, email, password, inviteToken } = req.body || {};
    const isBrowser = req.headers.accept && req.headers.accept.includes("text/html");

    if (!inviteToken) {
      const msg = "⚠️ Unable to sign up — a valid access link is required.";
      if (isBrowser)
        return res.render("signup", { inviteRequired: true, inviteToken: null, errorMessage: msg });
      return res.status(403).json({ message: "Access link required." });
    }

    const tokenHash = sha256(inviteToken);
    const invite = await Invite.findOne({ tokenHash, disabled: false });

    if (!invite) {
      const msg = "⚠️ Invalid or revoked access link.";
      if (isBrowser)
        return res.render("signup", { inviteRequired: true, inviteToken: null, errorMessage: msg });
      return res.status(403).json({ message: msg });
    }

    if (invite.expiresAt <= new Date()) {
      const msg = "⚠️ This access link has expired.";
      if (isBrowser)
        return res.render("signup", { inviteRequired: true, inviteToken: null, errorMessage: msg });
      return res.status(403).json({ message: msg });
    }

    if (invite.uses >= invite.maxUses) {
      const msg = "⚠️ This access link has already been used.";
      if (isBrowser)
        return res.render("signup", { inviteRequired: true, inviteToken: null, errorMessage: msg });
      return res.status(403).json({ message: msg });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      verified: false,
      registrationDate: new Date(),
    });

    // consume invite
    invite.uses += 1;
    invite.usedBy.push(user._id);
    if (invite.uses >= invite.maxUses) invite.disabled = true;
    await invite.save();

    // OTP + Verification token
    const OTP = generateOTP();
    await VerificationToken.create({ owner: user._id, token: OTP });

    // Send welcome email
    try {
      await sendMail({
        to: user.email,
        subject: "Welcome to Ripple-Ledger 🎉",
        html: welcomeEmailTemplate({ name: user.username || user.email }),
      });
    } catch (e) {
      console.error("Welcome email failed:", e?.message);
    }

    // small delay
    await new Promise((r) => setTimeout(r, 800));

    // Send verification email
    try {
      await sendMail({
        to: user.email,
        subject: "Verify Your Ripple-Ledger Account",
        html: verificationEmailTemplate({ name: user.username || user.email, otp: OTP }),
      });
    } catch (e) {
      console.error("Verification email failed:", e?.message);
    }

    if (isBrowser) {
      return res.render("signup_success", {
        message: "✅ Account created successfully. Please check your email to verify your account.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Signup successful! Please check your email for the OTP to verify your account.",
      userId: user._id,
      redirect: "/verify",
    });
  } catch (err) {
    console.error("signup_post error:", err);
    const errors = handleErrors(err);
    const isBrowser = req.headers.accept && req.headers.accept.includes("text/html");
    if (isBrowser) {
      return res.render("signup", {
        inviteRequired: true,
        inviteToken: null,
        errorMessage: "⚠️ Signup failed — check details and try again.",
      });
    }
    return res.status(400).json({ errors });
  }
};

// ---------------- LOGIN ----------------
export const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
        role: user.role || (user.email === process.env.ADMIN_EMAIL ? "admin" : "user"),
      },
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// ---------------- VERIFY OTP ----------------
export const verify_post = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) return res.status(400).json({ message: "Missing parameters" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verified) return res.status(400).json({ message: "User already verified" });

    const tokenDoc = await VerificationToken.findOne({ owner: user._id }).sort({ createdAt: -1 });
    if (!tokenDoc) return res.status(400).json({ message: "No OTP found or expired" });

    const isValid = await tokenDoc.compareToken(otp);
    if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

    user.verified = true;
    await user.save();
    await VerificationToken.deleteMany({ owner: user._id });

    res.status(200).json({ success: true, message: "Account verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// forgot password
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with that email." });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save hashed token & expiry
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    const resetLink = `${process.env.APP_URL}/reset-password/${resetToken}`;

    // Send email via Resend
    await sendMail({
      to: user.email,
      subject: "Password Reset Request - Ripple-Ledger",
      html: resetEmailTemplate({ name: user.name, link: resetLink }),
    });

    res.status(200).json({
      message: "Password reset email sent successfully.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error while sending reset link." });
  }
}

// reset password
export async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error while resetting password." });
  }
}

// ---------------- DEFAULT EXPORT ----------------
export default {
  login_get,
  logout_get,
  signup_get,
  signup_post,
  login_post,
  verify_post,
  forgotPassword,
  resetPassword
};
