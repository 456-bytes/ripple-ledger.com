// middleWare/adminAuth.js
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// ✅ Require login first
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Auth token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'i love drug and it was created by me', async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = await User.findById(decodedToken.id);
    next();
  });
};

// ✅ Require admin role
const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  next();
};

export default { requireAuth, requireAdmin };
