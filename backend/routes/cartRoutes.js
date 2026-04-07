const express = require('express');
const router  = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect, buyerOnly } = require('../middleware/auth');

router.get('/',                protect, buyerOnly, getCart);
router.post('/',               protect, buyerOnly, addToCart);
router.put('/:productId',      protect, buyerOnly, updateCartItem);
router.delete('/clear',        protect, buyerOnly, clearCart);
router.delete('/:productId',   protect, buyerOnly, removeFromCart);

module.exports = router;
