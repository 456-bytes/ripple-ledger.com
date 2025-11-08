const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: true, // use SSL on port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  authMethod: "LOGIN",
});

// Generic sendMail wrapper
async function sendMail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.EMAIL_USER, // ✅ FIX
      to,
      subject,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ sendMail error:", err.message);
    throw err;
  }
}

//
// ------------------ EMAIL TEMPLATES ------------------
//

// ✅ Welcome Email
function welcomeEmailTemplate({ name }) {
  return `
    <div style="font-family: Arial, sans-serif">
      <h2>Welcome to Ripple-Ledger 🎉</h2>
      <p>Hi ${name || "there"},</p>
      <p>
    We’re excited to have you join <b>Ripple-Ledger</b> your trusted platform for secure digital asset management 
    and investment opportunities.
  </p>
  <p>
    Get started by verifying your 6 digit otp code and logging in to your dashboard to explore our features and take full control of your portfolio.
  </p>
  <p>— The Ripple-Ledger Team</p>
    </div>
  `;
}

// ✅ Verification Email
function verificationEmailTemplate({ name, otp }) {
  return `
    <div style="font-family: Arial, sans-serif">
      <h2>Email Verification - Ripple-Ledger</h2>
      <p>Hi ${name || "there"},</p>
      <p>Your verification code is:</p>
      <h2 style="color:#2563eb; letter-spacing:3px;">${otp}</h2>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br/>
      <p>— Ripple-Ledger Security Team</p>
    </div>
  `;
}

// ✅ Credit Email
function creditEmailTemplate({ name, walletType, amount, balance }) {
  return `
    <div style="font-family: Arial, sans-serif">
      <h3>Account Credited ✅</h3>
      <p>Hi ${name || "there"},</p>
      <p>Your <b>${walletType}</b> wallet has been credited with <b>${amount}</b>.</p>
      <p>New balance: <b>${balance}</b></p>
      <p>— Ripple-Ledger Finance</p>
    </div>
  `;
}

// ✅ Debit Email
function debitEmailTemplate({ name, walletType, amount, balance }) {
  return `
    <div style="font-family: Arial, sans-serif">
      <h3>Account Debited ⚠️</h3>
      <p>Hi ${name || "there"},</p>
      <p>Your <b>${walletType}</b> wallet has been debited by <b>${amount}</b>.</p>
      <p>New balance: <b>${balance}</b></p>
      <p>— Ripple-Ledger Finance</p>
    </div>
  `;
}

//
// ------------------ EXPORTS ------------------
//
module.exports = {
  sendMail,
  welcomeEmailTemplate,
  verificationEmailTemplate,
  creditEmailTemplate,
  debitEmailTemplate,
};
