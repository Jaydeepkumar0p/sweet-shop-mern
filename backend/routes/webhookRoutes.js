const express = require('express');
const router  = express.Router();
const Stripe  = require('stripe');
const Order   = require('../models/Order');
const stripe  = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
  const sig    = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  // If no webhook secret configured, just return 200
  if (!secret) return res.json({ received: true });

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    await Order.findOneAndUpdate(
      { stripePaymentIntentId: pi.id },
      { paymentStatus: 'Paid', orderStatus: 'Confirmed' }
    );
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object;
    await Order.findOneAndUpdate(
      { stripePaymentIntentId: pi.id },
      { paymentStatus: 'Failed' }
    );
  }

  res.json({ received: true });
});

module.exports = router;
