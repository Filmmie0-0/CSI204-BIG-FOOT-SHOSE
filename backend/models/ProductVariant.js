const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant_name: { type: String, required: true, maxlength: 50 },
  variant_value: { type: String, required: true, maxlength: 50 },
  additional_price: { type: Number, default: 0 },
  stock_quantity: { type: Number, default: 0 }
});

module.exports = mongoose.model('ProductVariant', productVariantSchema);
