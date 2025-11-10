import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const verificationTokenSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // auto delete after 10 minutes
  },
});

// hash token before saving
verificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    const hash = await bcrypt.hash(this.token, 8);
    this.token = hash;
  }
  next();
});

// compare plain token with hashed token in DB
verificationTokenSchema.methods.compareToken = async function (token) {
  return await bcrypt.compare(token, this.token);
};

export default mongoose.model("VerificationToken", verificationTokenSchema);
