const express = require('express');
const { 
  addOrderItems, 
  getOrderById, 
  getMyOrders, 
  getOrders, 
  updateOrderToPaid, 
  updateOrderToDelivered,
  createPaymentIntent,
  deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/', protect, admin, getOrders); 
router.get('/myorders/:userId', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/:id/create-payment-intent', protect, createPaymentIntent);
router.put('/:id/pay', protect, updateOrderToPaid); 
router.put('/:id/deliver', protect, admin, updateOrderToDelivered); 
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;
