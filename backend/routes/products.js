const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, admin, productController.createProduct);
router.put('/:id', protect, admin, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

// Review routes
router.get('/:id/reviews', productController.getProductReviews);
router.post('/:id/reviews', protect, productController.createProductReview);

module.exports = router;
