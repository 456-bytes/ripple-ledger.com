require("dotenv").config();
const { sendMail } = require("./utils/mailer");

console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "********" : "MISSING");

(async () => {
  try {
    await sendMail({
      to: "henryrobert1840@gmail.com", // test email
      subject: "Test from Ripple-Ledger",
      html: "<p>This is a test email from Ripple-Ledger ✅</p>",
    });
  } catch (err) {
    console.error("❌ Test email failed:", err.message);
  }
})();
