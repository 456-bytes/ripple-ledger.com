import mongoose from 'mongoose';

const WithdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
  method: { type: String, enum: ['BTC','XRP','XLM','USDT-TRC20','USDT-ERC20','USDT-BEP20'], required: true },
  address: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  source: { type: String, enum: ['stake','stakeProfit','airdrop','airdropProfit'], required: true },
  status: { type: String, enum: ['pending','approved','rejected','paid'], default: 'pending', index: true },
  note: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true });

export default mongoose.model('Withdrawal', WithdrawalSchema);
