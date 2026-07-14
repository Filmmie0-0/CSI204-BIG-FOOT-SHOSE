require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    
    // Check if an admin exists
    let admin = await User.findOne({ role: 'admin' });
    
    if (admin) {
      console.log(`Admin user already exists: ${admin.email}`);
      // Let's reset the password so the user can log in
      admin.password_hash = '12345678';
      await admin.save();
      console.log('Password has been reset to: 12345678');
    } else {
      admin = await User.create({
        username: 'admin',
        email: 'admin@bigfoot.com',
        password_hash: '12345678',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin'
      });
      console.log('Created new Admin account!');
      console.log(`Email: admin@bigfoot.com`);
      console.log(`Password: 12345678`);
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
