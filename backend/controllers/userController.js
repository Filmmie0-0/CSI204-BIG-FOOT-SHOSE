const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    ลงทะเบียนผู้ใช้ใหม่ (Register)
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    console.log("มีคนเรียก API Register แล้ว! ข้อมูลที่ส่งมาคือ:", req.body);
    // Accepting both camelCase and snake_case for flexibility
    const { username, email, password, firstName, lastName, phoneNumber, first_name, last_name, phone_number } = req.body;
    
    // เช็คว่ามีอีเมลหรือ username นี้ในระบบหรือยัง
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'มีอีเมลหรือ Username นี้ในระบบแล้ว' });
    }

    // สร้าง User ใหม่
    const user = await User.create({
      username,
      email,
      password_hash: password, // mapping password to password_hash
      first_name: firstName || first_name,
      last_name: lastName || last_name,
      phone_number: phoneNumber || phone_number,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'ข้อมูลผู้ใช้งานไม่ถูกต้อง' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    เข้าสู่ระบบ (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // หา User จากอีเมล
    const user = await User.findOne({ email });

    // ตรวจสอบรหัสผ่าน (ใช้ฟังก์ชัน matchPassword ที่เราเขียนไว้ใน Model)
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Public
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      
      // ถ้ามีการกรอกรหัสผ่านใหม่เข้ามา ให้เปลี่ยนรหัสผ่านด้วย
      if (req.body.password) {
        user.password_hash = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        // ส่งข้อมูลที่อัปเดตกลับไปที่หน้าเว็บ
      });
    } else {
      res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    }
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล', error: error.message });
  }
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    เข้าสู่ระบบด้วย Google
// @route   POST /api/users/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    // ตรวจสอบ token กับ Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, given_name, family_name, sub } = payload;
    
    // ค้นหาผู้ใช้จากอีเมล
    let user = await User.findOne({ email });
    
    if (user) {
      // มีผู้ใช้อยู่แล้ว ให้ล็อกอินเลย
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      // ยังไม่มีผู้ใช้ ให้สร้างใหม่
      const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // สุ่มรหัสผ่าน
      
      // หา username ที่ไม่ซ้ำ
      let username = name.replace(/\s+/g, '').toLowerCase();
      let usernameExists = await User.findOne({ username });
      if (usernameExists) {
        username = username + sub.substring(0, 4);
      }
      
      user = await User.create({
        username: username,
        email: email,
        password_hash: password, // ใส่รหัสผ่านสุ่มไว้
        first_name: given_name || name,
        last_name: family_name || '',
      });
      
      if (user) {
        res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json({ message: 'ไม่สามารถสร้างบัญชีผู้ใช้ได้' });
      }
    }
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Google authentication failed', error: error.message });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile, googleLogin };
