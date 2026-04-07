const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// GET /api/user/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ success: true, user });
});

// PUT /api/user/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, shopName, shopDescription } = req.body;
  const user = await User.findById(req.user._id);

  if (name)            user.name    = name;
  if (phone)           user.phone   = phone;
  if (address)         user.address = { ...user.address, ...address };
  if (shopName)        user.shopName        = shopName;
  if (shopDescription) user.shopDescription = shopDescription;

  if (req.file) user.avatar = req.file.path;

  await user.save();
  const updated = await User.findById(user._id).select('-password');
  res.json({ success: true, message: 'Profile updated', user: updated });
});

module.exports = { getProfile, updateProfile };
