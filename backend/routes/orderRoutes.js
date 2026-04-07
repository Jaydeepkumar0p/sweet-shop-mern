const express = require('express');
const router  = express.Router();
const { placeOrder, getMyOrders, getOrderById, updateOrderStatus, getSellerOrders } = require('../controllers/orderController');
const { protect, buyerOnly, sellerOnly } = require('../middleware/auth');

router.post('/',           protect, buyerOnly,  placeOrder);
router.get('/my',          protect, buyerOnly,  getMyOrders);
router.get('/seller',      protect, sellerOnly, getSellerOrders);
router.get('/:id',         protect,             getOrderById);
router.patch('/:id/status',protect, sellerOnly, updateOrderStatus);

module.exports = router;
