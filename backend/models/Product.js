const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  name: { type: String, required: true, maxlength: 150 },
  sku: { type: String, required: true, unique: true, maxlength: 100 },
  description: { type: String },
  price: { type: Number, required: true }, // Using Number for decimal
  discount_price: { type: Number },
  image_url: { type: String },
  sizes: [{ type: String }], // เพิ่มฟิลด์ sizes
  gender: { type: String, enum: ['Men', 'Women', 'Kids', 'Unisex'] }, // Added gender for category selection
  countInStock: { type: Number, required: true, default: 10 },
  status: { type: String, enum: ['active', 'draft', 'out_of_stock'], default: 'active' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Product', productSchema);
