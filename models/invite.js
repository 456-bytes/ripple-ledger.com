import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const inviteSchema = new Schema({
  tokenHash: { type: String, required: true, unique: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
  maxUses: { type: Number, default: 1 },
  uses: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  usedBy: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  disabled: { type: Boolean, default: false },
}, { timestamps: true });

inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto cleanup expired links

export default mongoose.model('Invite', inviteSchema);
