require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const updateSizes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    
    // Add default sizes to all products that don't have sizes or have empty sizes
    const result = await Product.updateMany(
      { $or: [{ sizes: { $exists: false } }, { sizes: { $size: 0 } }] },
      { $set: { sizes: ['38', '39', '40', '41', '42', '43'] } }
    );
    
    console.log(`Updated ${result.modifiedCount} products with default sizes.`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateSizes();
