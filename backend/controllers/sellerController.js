const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Order   = require('../models/Order');

// GET /api/seller/dashboard
const getDashboard = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const [products, orders] = await Promise.all([
    Product.find({ seller: sellerId, isActive: true }),
    Order.find({ 'items.seller': sellerId }).populate('buyer', 'name email'),
  ]);

  const revenue       = orders.reduce((sum, o) => {
    const sellerItems = o.items.filter(i => i.seller?.toString() === sellerId.toString());
    return sum + sellerItems.reduce((s, i) => s + i.price * i.quantity, 0);
  }, 0);

  const totalOrders   = orders.length;
  const totalProducts = products.length;
  const lowStock      = products.filter(p => p.stock <= 5);

  const recentOrders  = orders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);

  // Revenue by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyRevenue = {};
  orders.filter(o => o.createdAt >= sixMonthsAgo).forEach(o => {
    const month = o.createdAt.toLocaleString('default', { month: 'short', year: '2-digit' });
    const sellerTotal = o.items
      .filter(i => i.seller?.toString() === sellerId.toString())
      .reduce((s, i) => s + i.price * i.quantity, 0);
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + sellerTotal;
  });

  // Category distribution
  const catDist = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    stats: { revenue, totalOrders, totalProducts, lowStockCount: lowStock.length },
    recentOrders,
    lowStockProducts: lowStock,
    monthlyRevenue,
    categoryDistribution: catDist,
  });
});

// GET /api/seller/products
const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, products });
});

module.exports = { getDashboard, getSellerProducts };
