const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Address = require('../models/Address');
const Product = require('../models/Product');

const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice, user } = req.body;
    const userId = user || (req.user ? req.user._id : null);

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'ไม่มีสินค้าในตะกร้า' });
    } else {
      let shipping_address_id;
      if (shippingAddress && userId) {
        // Create an address record
        const address = await Address.create({
          user_id: userId,
          address_type: 'shipping',
          receiver_name: shippingAddress.name || 'Receiver',
          receiver_phone: shippingAddress.phone || '0000000000',
          address_line1: shippingAddress.address || 'Address',
          city: shippingAddress.city || 'City',
          state: shippingAddress.country || 'State',
          postal_code: shippingAddress.postalCode || '00000'
        });
        shipping_address_id = address._id;
      }

      const order = new Order({
        user_id: userId,
        shipping_address_id,
        total_amount: totalPrice || itemsPrice,
        shipping_fee: shippingPrice || 0,
        order_status: 'pending'
      });

      const createdOrder = await order.save();
      
      // Save order items
      if (orderItems) {
        for (let item of orderItems) {
           await OrderItem.create({
             order_id: createdOrder._id,
             product_id: item.product || item._id,
             quantity: item.qty || item.quantity || 1,
             price_per_unit: item.price || 0
           });
           
           // Decrement stock
           const productId = item.product || item._id;
           const qty = item.qty || item.quantity || 1;
           const product = await Product.findById(productId);
           if (product) {
             product.countInStock = product.countInStock - qty;
             if (product.countInStock < 0) product.countInStock = 0;
             await product.save();
           }
        }
      }

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user_id', 'username email')
      .populate('shipping_address_id');
    if (order) {
      const items = await OrderItem.find({ order_id: order._id }).populate('product_id');
      const orderWithItems = { ...order._doc, orderItems: items, user: order.user_id };
      res.json(orderWithItems);
    } else {
      res.status(404).json({ message: 'ไม่พบคำสั่งซื้อนี้' });
    }
  } catch (error) {
    res.status(500).json({ message: 'รูปแบบ ID ไม่ถูกต้อง หรือเกิดข้อผิดพลาด' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.params.userId || (req.user ? req.user._id : null);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });
    
    const orders = await Order.find({ user_id: userId }).sort({ created_at: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงประวัติคำสั่งซื้อ' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user_id', 'username');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อทั้งหมด' });
  }
};

const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.order_status = 'processing';
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'ไม่พบคำสั่งซื้อ' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.order_status = 'delivered';
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'ไม่พบคำสั่งซื้อ' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummyKeyToPreventCrash');

const createPaymentIntent = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const amountInThb = order.total_amount || 0; // if it's missing or 0, fallback
    const stripeAmount = Math.max(Math.round(amountInThb * 100), 1000); // minimum 10 THB (1000 subunits)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency: 'thb',
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'ไม่พบคำสั่งซื้อ' });
    }
    await OrderItem.deleteMany({ order_id: order._id });
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบคำสั่งซื้อเรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบคำสั่งซื้อ' });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  createPaymentIntent,
  deleteOrder
};
