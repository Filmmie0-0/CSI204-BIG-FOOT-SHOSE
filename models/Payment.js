const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  payment_method: { type: String, required: true, maxlength: 50 }, // credit_card, promptpay, cod
  payment_status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  transaction_id: { type: String, maxlength: 150 },
  amount_paid: { type: Number, required: true },
  paid_at: { type: Date }
});

module.exports = mongoose.model('Payment', paymentSchema);
