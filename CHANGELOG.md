Changelog - modifications performed

1) Added models:
   - models/ledger.js  (ledger entries for balance changes)
   - models/withdrawal.js  (withdrawal requests)

2) Added mailer utility:
   - utils/mailer.js (nodemailer wrapper + email templates)

3) Added admin middleware & routes:
   - middleWare/adminAuth.js
   - adminRoutes.js
   - controllers/adminController.js

4) Augmented user model:
   - Added fields: stakeBalance, stakeProfit, airdropBalance, airdropProfit, role, wallets, notify flags.
     (Inserted via userSchema.add to remain non-invasive.)

5) Hooked welcome-email to signup flow:
   - controllers/authController.js updated to send a welcome email after user creation.

6) Minor improvements:
   - middleWare/authMiddleware.js now uses process.env.JWT_SECRET as the JWT secret (fallback to existing string).
   - server.js now mounts /admin endpoints.

Notes: The original project contains partial files with placeholders ('...') in several places. I made conservative, non-destructive changes: backups are in the backup folder. See /backup for originals.

Important next steps (manual review recommended):
 - Validate and set environment variables: SMTP config (EMAIL_USER, EMAIL_PASS or SMTP_*), JWT_SECRET, ADMIN_EMAIL (if you want an env-defined admin).
 - Test the admin endpoints with a logged-in admin user (set role to 'admin' in DB or set ADMIN_EMAIL).
 - Add address validation per chain when accepting withdrawal addresses.
 - Secure admin routes further (2FA / IP allowlist) before production use.
