require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    const user = await User.findOne({ email: 'admin@bigfoot.com' });
    if (!user) {
      console.log('User not found');
    } else {
      console.log('User found:', user.email);
      const isMatch = await user.matchPassword('admin1234');
      console.log('Password match?', isMatch);
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

testLogin();
