
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/users', protect, admin, userController.getAllUsers); // New route to get all users
router.put('/users/:id', protect, admin, userController.updateUser); // New route to update a user
router.delete('/users/:id', protect, admin, userController.deleteUser); // New route to delete a user
router.get('/me', protect, userController.getCurrentUser); // New route to get current user data

module.exports = router;
