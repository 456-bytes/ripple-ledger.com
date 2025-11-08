// controllers/authController.js
const User = require("../models/user");
const VerificationToken = require("../models/verificationToken");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const Invite = require('../models/invite');

function sha256(s){ return crypto.createHash('sha256').update(s).digest('hex'); }

const { generateOTP } = require("../utils/otp"); 
const { sendMail, welcomeEmailTemplate, verificationEmailTemplate } = require("../utils/mailer");

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

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '3d'
  });
};

// ---------------- GET ROUTES ----------------
module.exports.login_get = (req, res) => res.render("login");
module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

// ---------------- SIGNUP (invite-only) ----------------
module.exports.signup_get = async (req, res) => {
  try {
    const { invite } = req.query;

    // If no invite in query: show signup page (but mark inviteRequired)
    if (!invite) {
      return res.render("signup", {
        inviteRequired: true,
        inviteToken: null,
        errorMessage: null
      });
    }

    // Validate invite
    const tokenHash = sha256(invite);
    const inviteDoc = await Invite.findOne({ tokenHash, disabled: false }).lean();

    const now = new Date();
    const valid = inviteDoc && inviteDoc.uses < inviteDoc.maxUses && inviteDoc.expiresAt > now;

    if (!valid) {
      return res.render("signup", {
        inviteRequired: true,
        inviteToken: null,
        errorMessage: "⚠️ This access link is invalid, used up, or expired."
      });
    }

    // Valid link — render signup form and include invite token
    return res.render("signup", {
      inviteRequired: false,
      inviteToken: invite,
      errorMessage: null
    });

  } catch (e) {
    console.error("signup_get error", e);
    return res.render("signup", {
      inviteRequired: true,
      inviteToken: null,
      errorMessage: "⚠️ Server error validating access link."
    });
  }
};

module.exports.signup_post = async (req, res) => {
  try {
    // Accept both form and JSON
    const { username, email, password, inviteToken } = req.body || {};
    const isBrowser = req.headers.accept && req.headers.accept.includes("text/html");
    console.log("signup_post called — inviteToken present?", Boolean(inviteToken));

    // Enforce invite presence
    if (!inviteToken) {
      const msg = "⚠️ Unable to sign up — a valid access link is required.";
      if (isBrowser) {
        return res.render("signup", { inviteRequired: true, inviteToken: null, errorMessage: msg });
      }
      return res.status(403).json({ message: "Access link required." });
    }

    const tokenHash = sha256(inviteToken);
    const invite = await Invite.findOne({ tokenHash, disabled: false });

    if (!invite) {
      const msg = "⚠️ Invalid or revoked access link.";
      if (isBrowser) return res.render("signup", { inviteRequired: true, inviteToken: null, errorMessage: msg });
      return res.status(403).json({ message: msg });
    }

    if (invite.expiresAt <= new Date()) {
      const msg = "⚠️ This access link has expired.";
      if (isBrowser) return res.render("signup", { inviteRequired: true, inviteToken: null, errorMessage: msg });
      return res.status(403).json({ message: msg });
    }

    if (invite.uses >= invite.maxUses) {
      const msg = "⚠️ This access link has already been used.";
      if (isBrowser) return res.render("signup", { inviteRequired: true, inviteToken: null, errorMessage: msg });
      return res.status(403).json({ message: msg });
    }

    // Create user (preserve your fields if you have extras)
    const user = await User.create({
      username,
      email,
      password,
      verified: false,
      registrationDate: new Date()
    });

    // consume invite
    invite.uses += 1;
    invite.usedBy.push(user._id);
    if (invite.uses >= invite.maxUses) invite.disabled = true;
    await invite.save();

    // OTP + Verification token
    const OTP = generateOTP();
    await VerificationToken.create({ owner: user._id, token: OTP });

    // Send emails (welcome then verification)
    try {
      await sendMail({
        to: user.email,
        subject: "Welcome to Ripple-Ledger 🎉",
        html: welcomeEmailTemplate({ name: user.username || user.email })
      });
    } catch (e) {
      console.error("Welcome email failed:", e && e.message);
    }

    // small delay (optional)
    await new Promise(r => setTimeout(r, 800));

    try {
      await sendMail({
        to: user.email,
        subject: "Verify Your Ripple-Ledger Account",
        html: verificationEmailTemplate({ name: user.username || user.email, otp: OTP })
      });
    } catch (e) {
      console.error("Verification email failed:", e && e.message);
    }

    if (isBrowser) {
      return res.render("signup_success", {
        message: "✅ Account created successfully. Please check your email to verify your account."
      });
    }

    return res.status(201).json({
      success: true,
      message: "Signup successful! Please check your email for the OTP to verify your account.",
      userId: user._id,
      redirect: "/verify"
    });

  } catch (err) {
    console.error("signup_post error:", err);
    const errors = handleErrors(err);
    // If browser, show error message atop form
    const isBrowser = req.headers.accept && req.headers.accept.includes("text/html");
    if (isBrowser) {
      return res.render("signup", { inviteRequired: true, inviteToken: null, errorMessage: "⚠️ Signup failed — check details and try again." });
    }
    return res.status(400).json({ errors });
  }
};

// ---------------- LOGIN ----------------
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3*24*60*60*1000 });

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
module.exports.verify_post = async (req, res) => {
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
