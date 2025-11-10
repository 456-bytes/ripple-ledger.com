import mongoose from 'mongoose';
import validator from 'validator';
const { isEmail } = validator;
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'please enter a username of your choice'],
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'please enter a strong password'],
    minlength: [6, 'minimum password length is 6 characters'],
  },
  wallet: { type: Number, default: 0.00 },
  profit: { type: Number, default: 0.00 },
  fundswithdraw: { type: Number, default: 0.00 },
  airdrop: { type: Number, default: 0.00 },
  airprofit: { type: Number, default: 0.00 },
  airwithdraw: { type: Number, default: 0.00 },
  registrationDate: { type: Date, default: Date.now },
  last_login_date: { type: Date }
});

// --- Hook: hash password before save ---
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next(new Error('Password is missing'));
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Static: update last login date ---
userSchema.statics.updateLastLogin = function (id, callback) {
  return this.findByIdAndUpdate(
    id,
    { $set: { last_login_date: Date.now() } },
    { new: true },
    callback
  );
};

// --- Static: login with email & password ---
userSchema.statics.login = async function (email, password) {
     const user = await this.findOne({ email });
     if (user) {
       if (!password || !user.password) {
         throw Error('Password missing');
       }
       const auth = await bcrypt.compare(password, user.password);
       if (auth) return user;
       throw Error('incorrect password');
     }
     throw Error('incorrect email');
   };
   

// --- Additional fields ---
userSchema.add({
  stakeBalance: { type: Number, default: 0 },
  stakeProfit: { type: Number, default: 0 },
  airdropBalance: { type: Number, default: 0 },
  airdropProfit: { type: Number, default: 0 },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  wallets: [{ chain: String, address: String }],
  notifyOnCredit: { type: Boolean, default: true },
  notifyOnDebit: { type: Boolean, default: true },
});

const User = mongoose.model('user', userSchema);
export default User;
