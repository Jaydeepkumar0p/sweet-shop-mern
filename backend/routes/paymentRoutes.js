const express = require('express');
const router  = express.Router();
const { createPaymentIntent } = require('../controllers/paymentController');
const { protect, buyerOnly }  = require('../middleware/auth');

router.post('/create-intent', protect, buyerOnly, createPaymentIntent);

module.exports = router;
