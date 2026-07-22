const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, default: '' },
  quantity: { type: Number, required: true, default: 1 }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('CartItem', cartItemSchema);
