const express = require('express');
const router  = express.Router();
const { getDashboard, getSellerProducts } = require('../controllers/sellerController');
const { protect, sellerOnly } = require('../middleware/auth');

router.get('/dashboard', protect, sellerOnly, getDashboard);
router.get('/products',  protect, sellerOnly, getSellerProducts);

module.exports = router;
