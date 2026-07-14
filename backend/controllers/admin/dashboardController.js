const Order = require('../../models/Order');
const Payment = require('../../models/Payment');
const Product = require('../../models/Product');

exports.getStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    
    // Sum amount_paid from completed payments
    const payments = await Payment.find({ payment_status: 'completed' });
    const totalRevenue = payments.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0);
    
    res.json({
      totalOrders,
      totalProducts,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving dashboard stats', error: error.message });
  }
};