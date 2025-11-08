module.exports = ({ name, amount, status }) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Withdrawal Status Update</h2>
    <p>Hi ${name || "there"},</p>
    <p>Your withdrawal request of <b>${amount}</b> has been <b>${status}</b>.</p>
    <p>Thank you for using Ripple-Ledger.</p>
  </div>
`;
