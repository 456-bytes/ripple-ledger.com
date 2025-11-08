const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Require authentication (valid JWT cookie)
 */
const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      console.log('No token found in cookies');
      return res.redirect('/login');
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'i love drug and it was created by me');

    // Attach both req.userId and full req.user
    const user = await User.findById(decodedToken.id);
    if (!user) {
      console.log('User not found for decoded token');
      return res.redirect('/login');
    }

    req.userId = user._id; // ✅ for backward compatibility
    req.user = user;       // ✅ ensures req.user._id exists (fixes your createInvite bug)
    next();

  } catch (err) {
    console.error('Auth error:', err.message);
    return res.redirect('/login');
  }
};

/**
 * Check user (for templating, not required routes)
 */
const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'i love drug and it was created by me');
      const user = await User.findById(decodedToken.id);
      res.locals.user = user;
      next();
    } catch (err) {
      console.error('checkUser error:', err.message);
      res.locals.user = null;
      return res.redirect('/login');
    }
  } else {
    res.locals.user = null;
    next();
  }
};

/**
 * Require admin role
 */
const requireAdmin = async (req, res, next) => {
  try {
    // Make sure req.user is set (from requireAuth)
    const user = req.user || (req.userId ? await User.findById(req.userId) : null);

    if (!user || user.role !== 'admin') {
      console.log('Admin access denied');
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    req.user = user; // ✅ make sure req.user is always available for controllers
    next();

  } catch (err) {
    console.error('requireAdmin error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { requireAuth, checkUser, requireAdmin };
