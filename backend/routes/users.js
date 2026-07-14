const express = require('express');
const { registerUser, loginUser, updateUserProfile, googleLogin } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); 
router.post('/google', googleLogin);
router.put('/:id', updateUserProfile);

module.exports = router;
