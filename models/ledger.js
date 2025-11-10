import mongoose from 'mongoose';

const LedgerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
  walletType: { type: String, enum: ['stake','stakeProfit','airdrop','airdropProfit'], required: true },
  type: { type: String, enum: ['credit','debit'], required: true },
  amount: { type: Number, required: true, min: 0 },
  balanceAfter: { type: Number, required: true },
  ref: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true });

export default mongoose.model('LedgerEntry', LedgerSchema);
