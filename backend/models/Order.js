const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shipping_address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  billing_address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  total_amount: { type: Number, required: true },
  shipping_fee: { type: Number, default: 0 },
  order_status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  tracking_number: { type: String, maxlength: 100 },
  payment_method: { type: String, required: true, default: 'Credit / Debit Card' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Order', orderSchema);
