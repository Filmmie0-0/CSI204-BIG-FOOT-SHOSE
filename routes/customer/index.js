const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/customer/profileController');
const orderController = require('../../controllers/customer/orderController');

// Middleware to check role 'customer' would be applied here

router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);
router.get('/orders', orderController.getMyOrders);
router.post('/orders', orderController.createOrder);

module.exports = router;
