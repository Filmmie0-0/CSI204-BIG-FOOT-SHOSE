const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const dashboardController = require('../../controllers/admin/dashboardController');

const { protect, admin } = require('../../middleware/authMiddleware');

router.use(protect, admin);
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.put('/users/:id/role', userController.updateUserRole);
router.delete('/users/:id', userController.deleteUser);
router.get('/dashboard', dashboardController.getStats);

module.exports = router;
