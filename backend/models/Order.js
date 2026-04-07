const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     String,
  image:    String,
  price:    Number,
  quantity: { type: Number, required: true, min: 1 },
  seller:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],

  shippingAddress: {
    fullName: { type: String, required: true },
    phone:    { type: String, required: true },
    street:   { type: String, required: true },
    city:     { type: String, required: true },
    state:    { type: String, required: true },
    pincode:  { type: String, required: true },
    country:  { type: String, default: 'India' },
  },

  paymentMethod:          { type: String, enum: ['COD', 'Stripe'], required: true },
  paymentStatus:          { type: String, enum: ['Pending','Paid','Failed','Refunded'], default: 'Pending' },
  stripePaymentIntentId:  { type: String, default: '' },

  orderStatus: {
    type: String,
    enum: ['Processing','Confirmed','Shipped','Out for Delivery','Delivered','Cancelled'],
    default: 'Processing',
  },

  subtotal:      { type: Number, required: true },
  shippingCharge:{ type: Number, default: 0 },
  discount:      { type: Number, default: 0 },
  totalAmount:   { type: Number, required: true },

  deliveredAt:  Date,
  cancelledAt:  Date,
  cancelReason: String,

  statusHistory: [{
    status:    String,
    timestamp: { type: Date, default: Date.now },
    note:      String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
