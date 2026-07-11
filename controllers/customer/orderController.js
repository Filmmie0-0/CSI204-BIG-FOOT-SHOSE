const Order = require('../../models/Order');
exports.getMyOrders = async (req, res) => { res.send('Customer Orders'); };
exports.createOrder = async (req, res) => { res.send('Create Order'); };