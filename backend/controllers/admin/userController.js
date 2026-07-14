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