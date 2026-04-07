const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  description:   { type: String, required: true },
  price:         { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  category: {
    type: String, required: true,
    enum: ['Chocolates','Mithai','Cakes','Cookies','Candies','Ice Cream','Dry Fruits','Gift Boxes','Others'],
  },
  stock:          { type: Number, required: true, default: 0, min: 0 },
  image:          { type: String, required: true },
  imagePublicId:  { type: String, default: '' },
  seller:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviews:        [reviewSchema],
  rating:         { type: Number, default: 0 },
  numReviews:     { type: Number, default: 0 },
  isFeatured:     { type: Boolean, default: false },
  isBestSeller:   { type: Boolean, default: false },
  weight:         { type: String, default: '' },
  tags:           [String],
  isActive:       { type: Boolean, default: true },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
