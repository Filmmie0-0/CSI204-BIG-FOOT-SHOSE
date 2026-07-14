const express = require('express');
const { registerUser, loginUser, updateUserProfile } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); 
router.put('/:id', updateUserProfile);

module.exports = router;
