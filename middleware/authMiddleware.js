const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // ดึง Token ออกมาจากคำว่า "Bearer token_xyz"
      token = req.headers.authorization.split(' ')[1];

      // ถอดรหัส Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // หา User จาก ID ใน Token และตัดรหัสผ่านออกไปก่อนส่งต่อ
      req.user = await User.findById(decoded.userId).select('-password_hash');
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
