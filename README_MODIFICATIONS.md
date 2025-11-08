Integration notes & quick start

Files added/changed: see CHANGELOG.md.

How to run locally:
1) Make sure you have node and npm installed.
2) In the project root, run `npm install` to install packages (check package.json).
3) Set environment variables (.env):
   - EMAIL_USER, EMAIL_PASS (for Gmail/SMTP) or SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS
   - JWT_SECRET (recommended)
   - ADMIN_EMAIL (optional; an email that will always be treated as admin)
4) Start the server: `node server.js` or `nodemon server.js`

Admin API endpoints (require admin cookie JWT):
 - GET  /admin/users
 - GET  /admin/users/:id/overview
 - POST /admin/users/:id/adjust
   body: { walletType, type: 'credit'|'debit', amount, ref }
 - GET  /admin/withdrawals?status=pending
 - POST /admin/withdrawals/:id/status
   body: { status: 'approved'|'rejected'|'paid', note }

Backup: original files were copied to `../josh_xrp_site_2_backup`

If anything fails, reply here and paste the server logs — I'll iterate quickly.
