const express = require('express');
const { 
  addOrderItems, 
  getOrderById, 
  getMyOrders, 
  getOrders, 
  updateOrderToPaid, 
  updateOrderToDelivered 
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', addOrderItems);
router.get('/', getOrders); 
router.get('/myorders/:userId', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/pay', updateOrderToPaid); 
router.put('/:id/deliver', updateOrderToDelivered); 

module.exports = router;
