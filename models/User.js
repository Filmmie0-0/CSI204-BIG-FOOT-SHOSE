const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash);
};

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password_hash')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
});

module.exports = mongoose.model('User', userSchema);
