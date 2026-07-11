const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

const directories = [
  'models',
  'routes/customer',
  'routes/admin',
  'routes/staff',
  'controllers/customer',
  'controllers/admin',
  'controllers/staff'
];

directories.forEach(dir => {
  fs.mkdirSync(path.join(projectRoot, dir), { recursive: true });
});

const models = {
  'User.js': `const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Assuming index.js exports sequelize instance

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  first_name: { type: DataTypes.STRING(50) },
  last_name: { type: DataTypes.STRING(50) },
  phone_number: { type: DataTypes.STRING(20) },
  role: { type: DataTypes.STRING(20), defaultValue: 'customer' }, // customer, admin, staff
  status: { type: DataTypes.STRING(20), defaultValue: 'active' } // active, suspended, inactive
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
`,
  'Address.js': `const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Address = sequelize.define('Address', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  address_type: { type: DataTypes.STRING(20) }, // shipping, billing
  receiver_name: { type: DataTypes.STRING(100), allowNull: false },
  receiver_phone: { type: DataTypes.STRING(20), allowNull: false },
  address_line1: { type: DataTypes.STRING(255), allowNull: false },
  address_line2: { type: DataTypes.STRING(255) },
  city: { type: DataTypes.STRING(100), allowNull: false },
  state: { type: DataTypes.STRING(100), allowNull: false },
  postal_code: { type: DataTypes.STRING(20), allowNull: false },
  is_default: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'addresses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Address;
`,
  'Category.js': `const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT },
  parent_id: { type: DataTypes.INTEGER }
}, {
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Category;
`,
  'Product.js': `const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category_id: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING(150), allowNull: false },
  sku: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  discount_price: { type: DataTypes.DECIMAL(10, 2) },
  status: { type: DataTypes.STRING(20), defaultValue: 'active' } // active, draft, out_of_stock
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Product;
`,
  'ProductVariant.js': `const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const ProductVariant = sequelize.define('ProductVariant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER },
  variant_name: { type: DataTypes.STRING(50), allowNull: false },
  variant_value: { type: DataTypes.STRING(50), allowNull: false },
  additional_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  stock_quantity: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'product_variants',
  timestamps: false
});

module.exports = ProductVariant;
`,
  'ProductImage.js': `const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const ProductImage = sequelize.define('ProductImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER },
  image_url: { type: DataTypes.STRING(255), allowNull: false },
  is_primary: { type: DataTypes.BOOLEAN, defaultValue: false },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'product_images',
  timestamps: false
});

module.exports = ProductImage;
`,
  'Cart.js': `const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, unique: true }
}, {
  tableName: 'carts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Cart;
`,
  'CartItem.js': `const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const CartItem = sequelize.define('CartItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cart_id: { type: DataTypes.INTEGER },
  product_id: { type: DataTypes.INTEGER },
  variant_id: { type: DataTypes.INTEGER },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, {
  tableName: 'cart_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = CartItem;
`,
  'Order.js': `const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  shipping_address_id: { type: DataTypes.INTEGER },
  billing_address_id: { type: DataTypes.INTEGER },
  total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  shipping_fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  order_status: { type: DataTypes.STRING(30), defaultValue: 'pending' }, // pending, processing, shipped, delivered, cancelled
  tracking_number: { type: DataTypes.STRING(100) }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Order;
`,
  'OrderItem.js': `const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER },
  product_id: { type: DataTypes.INTEGER },
  variant_id: { type: DataTypes.INTEGER },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price_per_unit: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
  tableName: 'order_items',
  timestamps: false
});

module.exports = OrderItem;
`,
  'Payment.js': `const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, unique: true },
  payment_method: { type: DataTypes.STRING(50), allowNull: false }, // credit_card, promptpay, cod
  payment_status: { type: DataTypes.STRING(30), defaultValue: 'pending' }, // pending, completed, failed, refunded
  transaction_id: { type: DataTypes.STRING(150) },
  amount_paid: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paid_at: { type: DataTypes.DATE }
}, {
  tableName: 'payments',
  timestamps: false
});

module.exports = Payment;
`,
  'ProductReview.js': `const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const ProductReview = sequelize.define('ProductReview', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  product_id: { type: DataTypes.INTEGER },
  rating: { type: DataTypes.INTEGER, allowNull: false }, // 1 to 5
  comment: { type: DataTypes.TEXT }
}, {
  tableName: 'product_reviews',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = ProductReview;
`,
  'index.js': `const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres', // or mysql
});

module.exports = sequelize;

// Models will be loaded and associated in a separate file (e.g. associations.js)
`,
  'associations.js': `const User = require('./User');
const Address = require('./Address');
const Category = require('./Category');
const Product = require('./Product');
const ProductVariant = require('./ProductVariant');
const ProductImage = require('./ProductImage');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');
const ProductReview = require('./ProductReview');

// Define Relationships

// User & Address
User.hasMany(Address, { foreignKey: 'user_id' });
Address.belongsTo(User, { foreignKey: 'user_id' });

// Categories & Sub-categories
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'SubCategories' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'ParentCategory' });

// Product & Category
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// Product & Variants, Images, Reviews
Product.hasMany(ProductVariant, { foreignKey: 'product_id' });
ProductVariant.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(ProductImage, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(ProductReview, { foreignKey: 'product_id' });
ProductReview.belongsTo(Product, { foreignKey: 'product_id' });
User.hasMany(ProductReview, { foreignKey: 'user_id' });
ProductReview.belongsTo(User, { foreignKey: 'user_id' });

// Cart
User.hasOne(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

Product.hasMany(CartItem, { foreignKey: 'product_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

ProductVariant.hasMany(CartItem, { foreignKey: 'variant_id' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'variant_id' });

// Order
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Address.hasMany(Order, { foreignKey: 'shipping_address_id', as: 'ShippingOrders' });
Order.belongsTo(Address, { foreignKey: 'shipping_address_id', as: 'ShippingAddress' });

Address.hasMany(Order, { foreignKey: 'billing_address_id', as: 'BillingOrders' });
Order.belongsTo(Address, { foreignKey: 'billing_address_id', as: 'BillingAddress' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

ProductVariant.hasMany(OrderItem, { foreignKey: 'variant_id' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variant_id' });

// Payment
Order.hasOne(Payment, { foreignKey: 'order_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = {
  User, Address, Category, Product, ProductVariant, ProductImage,
  Cart, CartItem, Order, OrderItem, Payment, ProductReview
};
`
};

for (const [filename, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(projectRoot, 'models', filename), content);
}

const controllers = {
  'customer/profileController.js': `const { User } = require('../../models/associations');
exports.getProfile = async (req, res) => { res.send('Customer Profile'); };
exports.updateProfile = async (req, res) => { res.send('Update Customer Profile'); };`,
  'customer/orderController.js': `const { Order } = require('../../models/associations');
exports.getMyOrders = async (req, res) => { res.send('Customer Orders'); };
exports.createOrder = async (req, res) => { res.send('Create Order'); };`,

  'admin/userController.js': `const { User } = require('../../models/associations');
exports.getAllUsers = async (req, res) => { res.send('All Users'); };
exports.updateUserRole = async (req, res) => { res.send('Update User Role'); };`,
  'admin/dashboardController.js': `const { Order, Payment } = require('../../models/associations');
exports.getStats = async (req, res) => { res.send('Dashboard Stats'); };`,

  'staff/productController.js': `const { Product } = require('../../models/associations');
exports.manageProducts = async (req, res) => { res.send('Manage Products'); };`,
  'staff/orderController.js': `const { Order } = require('../../models/associations');
exports.updateOrderStatus = async (req, res) => { res.send('Update Order Status'); };`
};

for (const [filepath, content] of Object.entries(controllers)) {
  fs.writeFileSync(path.join(projectRoot, 'controllers', filepath), content);
}

const routes = {
  'customer/index.js': `const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/customer/profileController');
const orderController = require('../../controllers/customer/orderController');

// Middleware to check role 'customer' would be applied here

router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);
router.get('/orders', orderController.getMyOrders);
router.post('/orders', orderController.createOrder);

module.exports = router;
`,
  'admin/index.js': `const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const dashboardController = require('../../controllers/admin/dashboardController');

// Middleware to check role 'admin' would be applied here

router.get('/users', userController.getAllUsers);
router.put('/users/:id/role', userController.updateUserRole);
router.get('/dashboard', dashboardController.getStats);

module.exports = router;
`,
  'staff/index.js': `const express = require('express');
const router = express.Router();
const productController = require('../../controllers/staff/productController');
const orderController = require('../../controllers/staff/orderController');

// Middleware to check role 'staff' would be applied here

router.get('/products', productController.manageProducts);
router.put('/orders/:id/status', orderController.updateOrderStatus);

module.exports = router;
`
};

for (const [filepath, content] of Object.entries(routes)) {
  fs.writeFileSync(path.join(projectRoot, 'routes', filepath), content);
}

// Write a main app.js
const appJs = `const express = require('express');
const app = express();

app.use(express.json());

// Routes
app.use('/api/customer', require('./routes/customer'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/staff', require('./routes/staff'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`;
fs.writeFileSync(path.join(projectRoot, 'app.js'), appJs);

console.log("Scaffolding complete.");
