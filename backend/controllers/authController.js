const asyncHandler   = require('express-async-handler');
const User           = require('../models/User');
const generateToken  = require('../utils/generateToken');

// @desc  Register
// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, shopName, shopDescription } = req.body;

  if (!name || !email || !password || !role)
    return res.status(400).json({ success: false, message: 'All fields are required' });

  if (!['buyer', 'seller'].includes(role))
    return res.status(400).json({ success: false, message: 'Role must be buyer or seller' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

  const user = await User.create({
    name, email, password, role,
    ...(role === 'seller' && { shopName: shopName || name + "'s Shop", shopDescription }),
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token:   generateToken(user._id),
    user:    sanitizeUser(user),
  });
});

// @desc  Login
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required' });

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ success: false, message: 'Invalid credentials' });

  if (!user.isActive)
    return res.status(403).json({ success: false, message: 'Account deactivated' });

  res.json({
    success: true,
    message: 'Login successful',
    token:   generateToken(user._id),
    user:    sanitizeUser(user),
  });
});

// @desc  Get logged-in user
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('cart.product', 'name price image stock')
    .populate('wishlist', 'name price image rating');
  res.json({ success: true, user });
});

// @desc  Update password
// @route PUT /api/auth/password
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!(await user.matchPassword(currentPassword)))
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated successfully' });
});

const sanitizeUser = (u) => ({
  _id:             u._id,
  name:            u.name,
  email:           u.email,
  role:            u.role,
  avatar:          u.avatar  || '',
  phone:           u.phone   || '',
  address:         u.address || {},
  shopName:        u.shopName        || '',
  shopDescription: u.shopDescription || '',
});

module.exports = { register, login, getMe, updatePassword };
