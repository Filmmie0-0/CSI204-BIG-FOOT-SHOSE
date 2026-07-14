require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    
    let admin = await User.findOne({ email: 'admin@bigfoot.com' });
    
    if (admin) {
      admin.password_hash = '12345678';
      await admin.save();
      console.log('Password forcibly reset to: 12345678');
    } else {
      console.log('Admin not found!');
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

resetAdmin();
