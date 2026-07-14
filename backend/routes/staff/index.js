const express = require('express');
const router = express.Router();
const productController = require('../../controllers/staff/productController');
const orderController = require('../../controllers/staff/orderController');

// Middleware to check role 'staff' would be applied here

router.get('/products', productController.manageProducts);
router.put('/orders/:id/status', orderController.updateOrderStatus);

module.exports = router;
