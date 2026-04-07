const asyncHandler = require('express-async-handler');
const Product      = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// GET /api/products  – public
const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, minPrice, maxPrice, rating, sort, page = 1, limit = 12 } = req.query;

  const filter = { isActive: true };
  if (keyword) filter.$text = { $search: keyword };
  if (category && category !== 'All') filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (rating) filter.rating = { $gte: Number(rating) };

  const sortMap = {
    newest:     { createdAt: -1 },
    'price-asc':  { price: 1 },
    'price-desc': { price: -1 },
    rating:     { rating: -1 },
    popular:    { numReviews: -1 },
  };
  const sortBy = sortMap[sort] || { createdAt: -1 };

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('seller', 'name shopName')
    .sort(sortBy)
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), products });
});

// GET /api/products/featured
const getFeatured = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate('seller', 'name shopName')
    .limit(8);
  res.json({ success: true, products });
});

// GET /api/products/bestsellers
const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isBestSeller: true })
    .populate('seller', 'name shopName')
    .limit(8);
  res.json({ success: true, products });
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('seller', 'name shopName shopDescription')
    .populate('reviews.user', 'name avatar');
  if (!product || !product.isActive)
    return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
});

// POST /api/products  – seller
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, originalPrice, category, stock, weight, tags, isFeatured, isBestSeller } = req.body;
  if (!req.file) return res.status(400).json({ success: false, message: 'Product image is required' });

  const product = await Product.create({
    name, description, price, originalPrice, category, stock, weight,
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    isFeatured:   isFeatured === 'true',
    isBestSeller: isBestSeller === 'true',
    image:         req.file.path,
    imagePublicId: req.file.filename,
    seller:        req.user._id,
  });
  res.status(201).json({ success: true, message: 'Product created', product });
});

// PUT /api/products/:id  – seller
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  if (product.seller.toString() !== req.user._id.toString())
    return res.status(403).json({ success: false, message: 'Not authorised' });

  const fields = ['name','description','price','originalPrice','category','stock','weight','isFeatured','isBestSeller'];
  fields.forEach(f => { if (req.body[f] !== undefined) product[f] = req.body[f]; });

  if (req.body.tags) product.tags = req.body.tags.split(',').map(t => t.trim());

  if (req.file) {
    if (product.imagePublicId) await cloudinary.uploader.destroy(product.imagePublicId).catch(() => {});
    product.image         = req.file.path;
    product.imagePublicId = req.file.filename;
  }
  await product.save();
  res.json({ success: true, message: 'Product updated', product });
});

// DELETE /api/products/:id  – seller
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  if (product.seller.toString() !== req.user._id.toString())
    return res.status(403).json({ success: false, message: 'Not authorised' });

  if (product.imagePublicId) await cloudinary.uploader.destroy(product.imagePublicId).catch(() => {});
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});

// POST /api/products/:id/review  – buyer
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  const already = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (already) return res.status(400).json({ success: false, message: 'Already reviewed' });

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.numReviews;
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

module.exports = { getProducts, getFeatured, getBestSellers, getProductById, createProduct, updateProduct, deleteProduct, addReview };
