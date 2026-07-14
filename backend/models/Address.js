const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address_type: { type: String, enum: ['shipping', 'billing'] },
  receiver_name: { type: String, required: true, maxlength: 100 },
  receiver_phone: { type: String, required: true, maxlength: 20 },
  address_line1: { type: String, required: true, maxlength: 255 },
  address_line2: { type: String, maxlength: 255 },
  city: { type: String, required: true, maxlength: 100 },
  state: { type: String, required: true, maxlength: 100 },
  postal_code: { type: String, required: true, maxlength: 20 },
  is_default: { type: Boolean, default: false }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('Address', addressSchema);
