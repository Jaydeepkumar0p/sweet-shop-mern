const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  fullName: { type: String, default: '' },
  phone:    { type: String, default: '' },
  street:   { type: String, default: '' },
  city:     { type: String, default: '' },
  state:    { type: String, default: '' },
  pincode:  { type: String, default: '' },
  country:  { type: String, default: 'India' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ['buyer', 'seller'], required: true },
  avatar:   { type: String, default: '' },
  phone:    { type: String, default: '' },
  address:  { type: addressSchema, default: () => ({}) },
  isActive: { type: Boolean, default: true },

  // Seller fields
  shopName:        { type: String, default: '' },
  shopDescription: { type: String, default: '' },

  // Buyer fields
  cart: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1, min: 1 },
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
