const asyncHandler = require('express-async-handler');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payment/create-intent
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body; // amount in rupees
  if (!amount || amount <= 0)
    return res.status(400).json({ success: false, message: 'Invalid amount' });

  const paymentIntent = await stripe.paymentIntents.create({
    amount:   Math.round(amount * 100), // paise
    currency: 'inr',
    metadata: { userId: req.user._id.toString() },
    automatic_payment_methods: { enabled: true },
  });

  res.json({
    success:      true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
});

module.exports = { createPaymentIntent };
