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
    
    // Get low stock products (e.g., countInStock <= 5)
    const lowStockItems = await Product.find({ countInStock: { $lte: 5 } }).select('name countInStock image_url');

    // Generate chart data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const orders = await Order.find({ created_at: { $gte: thirtyDaysAgo } }).sort('created_at');
    
    const chartDataMap = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      chartDataMap[dateString] = { name: dateString, orders: 0, revenue: 0 };
    }

    orders.forEach(order => {
      const dateString = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (chartDataMap[dateString]) {
        chartDataMap[dateString].orders += 1;
        chartDataMap[dateString].revenue += (order.total_amount || 0);
      }
    });

    const chartData = Object.values(chartDataMap);
    
    res.json({
      totalOrders,
      totalProducts,
      totalRevenue,
      lowStockItems,
      chartData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving dashboard stats', error: error.message });
  }
};