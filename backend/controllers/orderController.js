const asyncHandler = require('express-async-handler');
const Order   = require('../models/Order');
const Product = require('../models/Product');
const User    = require('../models/User');

// POST /api/orders  – buyer places order
const placeOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, stripePaymentIntentId } = req.body;

  if (!items || items.length === 0)
    return res.status(400).json({ success: false, message: 'No order items' });

  // Validate stock & build enriched items
  const enriched = [];
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive)
      return res.status(400).json({ success: false, message: `Product ${item.product} not available` });
    if (product.stock < item.quantity)
      return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });

    enriched.push({
      product:  product._id,
      name:     product.name,
      image:    product.image,
      price:    product.price,
      quantity: item.quantity,
      seller:   product.seller,
    });

    // Deduct stock
    product.stock -= item.quantity;
    await product.save();
  }

  const subtotal      = enriched.reduce((a, i) => a + i.price * i.quantity, 0);
  const shippingCharge= subtotal >= 499 ? 0 : 49;
  const totalAmount   = subtotal + shippingCharge;

  const order = await Order.create({
    buyer: req.user._id,
    items: enriched,
    shippingAddress,
    paymentMethod,
    paymentStatus:         paymentMethod === 'Stripe' ? 'Paid' : 'Pending',
    stripePaymentIntentId: stripePaymentIntentId || '',
    subtotal,
    shippingCharge,
    totalAmount,
    statusHistory: [{ status: 'Processing', note: 'Order placed' }],
  });

  // Clear buyer's cart
  await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });

  res.status(201).json({ success: true, message: 'Order placed successfully', order });
});

// GET /api/orders/my  – buyer
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate('items.product', 'name image')
    .sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('buyer', 'name email phone')
    .populate('items.product', 'name image price');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const isBuyer  = order.buyer._id.toString() === req.user._id.toString();
  const isSeller = order.items.some(i => i.seller?.toString() === req.user._id.toString());
  if (!isBuyer && !isSeller)
    return res.status(403).json({ success: false, message: 'Not authorised' });

  res.json({ success: true, order });
});

// PATCH /api/orders/:id/status  – seller updates status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const allowed = ['Confirmed','Shipped','Out for Delivery','Delivered','Cancelled'];
  if (!allowed.includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' });

  order.orderStatus = status;
  if (status === 'Delivered') {
    order.deliveredAt    = new Date();
    order.paymentStatus  = 'Paid'; // COD paid on delivery
  }
  if (status === 'Cancelled') order.cancelledAt = new Date();

  order.statusHistory.push({ status, note: note || '' });
  await order.save();
  res.json({ success: true, message: 'Order status updated', order });
});

// GET /api/orders/seller  – all orders containing seller's products
const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ 'items.seller': req.user._id })
    .populate('buyer', 'name email phone')
    .populate('items.product', 'name image')
    .sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

module.exports = { placeOrder, getMyOrders, getOrderById, updateOrderStatus, getSellerOrders };
