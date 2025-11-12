import dotenv from "dotenv";

// Load environment variables at module startup
dotenv.config();

/**
 * Dynamically imports the Resend library and initializes it.
 */
async function getResend() {
  const { Resend } = await import("resend");
  if (!process.env.RESEND_API_KEY) {
    throw new Error("❌ Missing RESEND_API_KEY in environment variables");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

/**
 * Generic email sender using Resend API.
 * @param {Object} params
 * @param {string|string[]} params.to - Recipient(s)
 * @param {string} params.subject - Email subject
 * @param {string} params.html - HTML email body
 */
export async function sendMail({ to, subject, html }) {
  try {
    const resend = await getResend();
    const data = await resend.emails.send({
      from: process.env.MAIL_FROM || "Ripple-Ledger <support@ripple-ledger.com>",
      to,
      subject,
      html,
    });
    console.log("✅ Email sent via Resend:", data?.id || data);
    return data;
  } catch (error) {
    console.error("❌ Failed to send email:", error?.message || error);
    throw error;
  }
}

//
// ------------------ EMAIL TEMPLATES ------------------
//

/** Welcome Email Template */
export function welcomeEmailTemplate({ name }) {
  return `
    <div style="font-family: Arial, sans-serif">
      <h2>Welcome to Ripple-Ledger 🎉</h2>
      <p>Hi ${name || "there"},</p>
      <p>
        We’re excited to have you join <b>Ripple-Ledger</b> — your trusted platform
        for secure digital asset management and investment opportunities.
      </p>
      <p>
        Get started by verifying your 6-digit OTP code and logging in to your dashboard
        to explore our features and take full control of your portfolio.
      </p>
      <p>— The Ripple-Ledger Team</p>
    </div>
  `;
}

/** Verification Email Template */
export function verificationEmailTemplate({ name, otp }) {
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

/** Credit Notification Template */
export function creditEmailTemplate({ name, walletType, amount, balance }) {
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

/** Debit Notification Template */
export function debitEmailTemplate({ name, walletType, amount, balance }) {
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

/** Withdrawal Status Email Template */
export function withdrawalStatusTemplate({ status, amount, method, address, note }) {
  return `
    <div style="font-family: Arial, sans-serif">
      <h3>Withdrawal ${status === 'approved' ? 'Approved ✅' : 'Rejected ⚠️'}</h3>
      <p>Amount: <b>${amount}</b></p>
      <p>Method: <b>${method}</b></p>
      <p>Address: <b>${address}</b></p>
      ${note ? `<p>Note: <i>${note}</i></p>` : ''}
      <p>— Ripple-Ledger Finance Team</p>
    </div>
  `;
}

export function resetEmailTemplate({ name, link }) {
  return `
    <div style="font-family: Arial, sans-serif">
      <h2>Password Reset Request</h2>
      <p>Hi ${name || "there"},</p>
      <p>You requested to reset your Ripple-Ledger account password.</p>
      <p>Click the link below to reset it (valid for 10 minutes):</p>
      <a href="${link}"
         style="display:inline-block;padding:10px 20px;background-color:#2563eb;color:white;text-decoration:none;border-radius:5px;">
         Reset Password
      </a>
      <p>If you didn’t request this, please ignore this email.</p>
      <br/>
      <p>— Ripple-Ledger Security Team</p>
    </div>
  `;
}
