const User = require('../../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password_hash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (req.body.role === 'admin') {
        return res.status(403).json({ message: 'คุณไม่สามารถให้สิทธิ์ Admin แก่ผู้อื่นได้' });
      }
      if (user.role === 'admin' && req.body.role !== 'admin') {
        return res.status(403).json({ message: 'คุณไม่สามารถแก้ไขหรือถอดถอนสิทธิ์ของ Admin คนอื่นได้' });
      }

      user.role = req.body.role || user.role;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
      res.status(500).json({ message: 'Error updating user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        return res.status(403).json({ message: 'ไม่สามารถลบ Admin ได้' });
      }
      await User.deleteOne({ _id: req.params.id });
      res.json({ message: 'ลบผู้ใช้เรียบร้อยแล้ว' });
    } else {
      res.status(404).json({ message: 'ไม่พบผู้ใช้นี้' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Username หรือ Email นี้มีผู้ใช้งานแล้ว' });
    }

    const user = await User.create({
      username,
      email,
      password_hash: password, // The model has a pre-save hook that will hash it
      role: role || 'staff'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};