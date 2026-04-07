const express = require('express');
const router  = express.Router();
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController');
const { protect, buyerOnly } = require('../middleware/auth');

router.get('/',    protect, buyerOnly, getWishlist);
router.post('/toggle', protect, buyerOnly, toggleWishlist);

module.exports = router;
