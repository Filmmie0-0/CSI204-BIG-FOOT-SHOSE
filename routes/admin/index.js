const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const dashboardController = require('../../controllers/admin/dashboardController');

// Middleware to check role 'admin' would be applied here

router.get('/users', userController.getAllUsers);
router.put('/users/:id/role', userController.updateUserRole);
router.get('/dashboard', dashboardController.getStats);

module.exports = router;
