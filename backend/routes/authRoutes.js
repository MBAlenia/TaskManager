const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Admin routes for user management
router.get('/users', protect, admin, userController.getAllUsers);
router.post('/users', protect, admin, userController.createUserByAdmin);
router.put('/users/:userId/password', protect, admin, userController.changeUserPassword);
router.put('/users/:userId', protect, admin, userController.updateUser);
router.delete('/users/:userId', protect, admin, userController.deleteUser);

// Protected routes for current user
router.get('/me', protect, userController.getCurrentUser);
router.put('/me/password', protect, userController.changePassword);

module.exports = router;