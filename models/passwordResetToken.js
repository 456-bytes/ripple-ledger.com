import mongoose from "mongoose";
import crypto from "crypto";

const passwordResetTokenSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // token auto-deletes after 10 mins
  },
});

passwordResetTokenSchema.methods.createToken = function () {
  const plainToken = crypto.randomBytes(32).toString("hex");
  this.token = crypto.createHash("sha256").update(plainToken).digest("hex");
  return plainToken;
};

export default mongoose.model("PasswordResetToken", passwordResetTokenSchema);
