const express = require('express');
const router  = express.Router();
const {
  getProducts, getFeatured, getBestSellers,
  getProductById, createProduct, updateProduct,
  deleteProduct, addReview
} = require('../controllers/productController');
const { protect, sellerOnly, buyerOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/',            getProducts);
router.get('/featured',    getFeatured);
router.get('/bestsellers', getBestSellers);
router.get('/:id',         getProductById);

router.post('/',     protect, sellerOnly, upload.single('image'), createProduct);
router.put('/:id',   protect, sellerOnly, upload.single('image'), updateProduct);
router.delete('/:id',protect, sellerOnly, deleteProduct);

router.post('/:id/review', protect, buyerOnly, addReview);

module.exports = router;
