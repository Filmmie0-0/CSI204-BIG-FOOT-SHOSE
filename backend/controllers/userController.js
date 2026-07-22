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
        profile_image: user.profile_image,
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
        profile_image: user.profile_image,
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
      if (req.body.profile_image !== undefined) {
        user.profile_image = req.body.profile_image;
      }
      
      // ถ้ามีการกรอกรหัสผ่านใหม่เข้ามา ให้เปลี่ยนรหัสผ่านด้วย
      if (req.body.password) {
        user.password_hash = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profile_image: updatedUser.profile_image,
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
        profile_image: user.profile_image,
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
          profile_image: user.profile_image,
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

const crypto = require('crypto');

// @desc    ลืมรหัสผ่าน (Forgot Password)
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งานด้วยอีเมลนี้' });
    }

    // สร้าง Token จำลอง
    const resetToken = crypto.randomBytes(20).toString('hex');

    // บันทึก Token และเวลาหมดอายุ (10 นาที) ลงใน Database
    user.reset_password_token = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.reset_password_expire = Date.now() + 10 * 60 * 1000;
    
    await user.save();

    // เนื่องจากไม่มีระบบส่งอีเมล เราจะส่ง Token กลับไปทาง response แทน
    // ในแอปจริง คุณต้องส่งเป็นลิงก์ไปทางอีเมล และไม่ควรส่ง token กลับไปตรงๆ
    res.status(200).json({ 
      success: true, 
      message: 'รหัสสำหรับการรีเซ็ตได้ถูกสร้างขึ้นแล้ว (จำลองการส่งอีเมล)',
      resetToken 
    });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};

// @desc    รีเซ็ตรหัสผ่าน (Reset Password)
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // เข้ารหัส token ที่ส่งมาจาก URL เพื่อไปเทียบกับใน Database
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      reset_password_token: resetPasswordToken,
      reset_password_expire: { $gt: Date.now() } // เช็คว่ายังไม่หมดอายุ
    });

    if (!user) {
      return res.status(400).json({ message: 'Token ไม่ถูกต้อง หรือหมดอายุแล้ว' });
    }

    // ตั้งรหัสผ่านใหม่
    user.password_hash = req.body.password;
    
    // เคลียร์ค่า Token ทิ้ง
    user.reset_password_token = undefined;
    user.reset_password_expire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'รีเซ็ตรหัสผ่านสำเร็จ'
    });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน', error: error.message });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile, googleLogin, forgotPassword, resetPassword };
