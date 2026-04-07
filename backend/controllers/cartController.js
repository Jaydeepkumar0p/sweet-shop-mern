const asyncHandler = require('express-async-handler');
const User         = require('../models/User');

// GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('cart.product', 'name price image stock isActive seller');
  const cart = user.cart.filter(item => item.product && item.product.isActive);
  res.json({ success: true, cart });
});

// POST /api/cart  – add or increment
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const user = await User.findById(req.user._id);
  const idx  = user.cart.findIndex(i => i.product.toString() === productId);

  if (idx > -1) {
    user.cart[idx].quantity += Number(quantity);
  } else {
    user.cart.push({ product: productId, quantity: Number(quantity) });
  }
  await user.save();
  const updated = await User.findById(req.user._id).populate('cart.product', 'name price image stock isActive');
  res.json({ success: true, message: 'Added to cart', cart: updated.cart });
});

// PUT /api/cart/:productId
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const user = await User.findById(req.user._id);
  const idx  = user.cart.findIndex(i => i.product.toString() === req.params.productId);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Item not in cart' });

  if (Number(quantity) <= 0) {
    user.cart.splice(idx, 1);
  } else {
    user.cart[idx].quantity = Number(quantity);
  }
  await user.save();
  const updated = await User.findById(req.user._id).populate('cart.product', 'name price image stock isActive');
  res.json({ success: true, cart: updated.cart });
});

// DELETE /api/cart/:productId
const removeFromCart = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { cart: { product: req.params.productId } },
  });
  const updated = await User.findById(req.user._id).populate('cart.product', 'name price image stock isActive');
  res.json({ success: true, message: 'Removed from cart', cart: updated.cart });
});

// DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
