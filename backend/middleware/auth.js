const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authorised – no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};

const sellerOnly = (req, res, next) => {
  if (req.user?.role === 'seller') return next();
  res.status(403).json({ success: false, message: 'Access denied – sellers only' });
};

const buyerOnly = (req, res, next) => {
  if (req.user?.role === 'buyer') return next();
  res.status(403).json({ success: false, message: 'Access denied – buyers only' });
};

module.exports = { protect, sellerOnly, buyerOnly };
