const asyncHandler = require('express-async-handler');
const User         = require('../models/User');

const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist', 'name price image rating category stock isActive');
  res.json({ success: true, wishlist: user.wishlist.filter(p => p.isActive) });
});

const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);
  const idx  = user.wishlist.indexOf(productId);
  let action;

  if (idx > -1) {
    user.wishlist.splice(idx, 1);
    action = 'removed';
  } else {
    user.wishlist.push(productId);
    action = 'added';
  }
  await user.save();
  res.json({ success: true, message: `${action} wishlist`, action });
});

module.exports = { getWishlist, toggleWishlist };
