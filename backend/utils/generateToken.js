const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // ให้ Token หมดอายุใน 30 วัน
  });
};

module.exports = generateToken;
