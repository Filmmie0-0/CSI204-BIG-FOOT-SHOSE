const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const modelsDir = path.join(projectRoot, 'models');

// Delete existing Sequelize models
if (fs.existsSync(modelsDir)) {
  fs.rmSync(modelsDir, { recursive: true, force: true });
}
fs.mkdirSync(modelsDir, { recursive: true });

const models = {
  'User.js': `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, maxlength: 100 },
  password_hash: { type: String, required: true, maxlength: 255 },
  first_name: { type: String, maxlength: 50 },
  last_name: { type: String, maxlength: 50 },
  phone_number: { type: String, maxlength: 20 },
  role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer' },
  status: { type: String, enum: ['active', 'suspended', 'inactive'], default: 'active' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('User', userSchema);
`,
  'Address.js': `const mongoose = require('mongoose');

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
`,
  'Category.js': `const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('Category', categorySchema);
`,
  'Product.js': `const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  name: { type: String, required: true, maxlength: 150 },
  sku: { type: String, required: true, unique: true, maxlength: 100 },
  description: { type: String },
  price: { type: Number, required: true }, // Using Number for decimal
  discount_price: { type: Number },
  status: { type: String, enum: ['active', 'draft', 'out_of_stock'], default: 'active' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Product', productSchema);
`,
  'ProductVariant.js': `const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant_name: { type: String, required: true, maxlength: 50 },
  variant_value: { type: String, required: true, maxlength: 50 },
  additional_price: { type: Number, default: 0 },
  stock_quantity: { type: Number, default: 0 }
});

module.exports = mongoose.model('ProductVariant', productVariantSchema);
`,
  'ProductImage.js': `const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  image_url: { type: String, required: true, maxlength: 255 },
  is_primary: { type: Boolean, default: false },
  sort_order: { type: Number, default: 0 }
});

module.exports = mongoose.model('ProductImage', productImageSchema);
`,
  'Cart.js': `const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Cart', cartSchema);
`,
  'CartItem.js': `const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', default: null },
  quantity: { type: Number, required: true, default: 1 }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('CartItem', cartItemSchema);
`,
  'Order.js': `const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shipping_address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  billing_address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  total_amount: { type: Number, required: true },
  shipping_fee: { type: Number, default: 0 },
  order_status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  tracking_number: { type: String, maxlength: 100 }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Order', orderSchema);
`,
  'OrderItem.js': `const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', default: null },
  quantity: { type: Number, required: true },
  price_per_unit: { type: Number, required: true }
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
`,
  'Payment.js': `const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  payment_method: { type: String, required: true, maxlength: 50 }, // credit_card, promptpay, cod
  payment_status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  transaction_id: { type: String, maxlength: 150 },
  amount_paid: { type: Number, required: true },
  paid_at: { type: Date }
});

module.exports = mongoose.model('Payment', paymentSchema);
`,
  'ProductReview.js': `const mongoose = require('mongoose');

const productReviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('ProductReview', productReviewSchema);
`,
  'db.js': `const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
      // options not strictly needed in Mongoose 6+
    });
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`Error: \${error.message}\`);
    process.exit(1);
  }
};

module.exports = connectDB;
`
};

for (const [filename, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(modelsDir, filename), content);
}

// Update app.js
const appJsPath = path.join(projectRoot, 'app.js');
let appJsContent = fs.readFileSync(appJsPath, 'utf8');

// If not already connected to DB in app.js, add it
if (!appJsContent.includes('connectDB')) {
  appJsContent = `const express = require('express');
const connectDB = require('./models/db');
const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

// Routes
app.use('/api/customer', require('./routes/customer'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/staff', require('./routes/staff'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`;
  fs.writeFileSync(appJsPath, appJsContent);
}

// Controller updates to require Mongoose models instead of sequelize associations
const controllersDir = path.join(projectRoot, 'controllers');

const fixControllerRequires = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixControllerRequires(fullPath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // replace const { Model } = require('../../models/associations');
      // with const Model = require('../../models/Model');
      content = content.replace(/const\s+\{\s*([^}]+)\s*\}\s*=\s*require\([^)]+associations[^)]+\);/g, (match, p1) => {
        const modelsToImport = p1.split(',').map(s => s.trim());
        return modelsToImport.map(m => `const ${m} = require('../../models/${m}');`).join('\n');
      });
      fs.writeFileSync(fullPath, content);
    }
  }
};

fixControllerRequires(controllersDir);

console.log("MongoDB Scaffolding complete.");
