const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  console.log('Register attempt:', req.body.username);
  const { username, password, level } = req.body;
  try {
    // For the first user, we'll make them an admin (level 10)
    // Check if any users exist
    const users = await userModel.getAllUsers();
    const userLevel = users.length === 0 ? 10 : (level || 1);
    
    const user = await userModel.createUser(username, password, userLevel);
    console.log('User registered:', user.username);
    res.status(201).json(user);
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  console.log('Login request received.');
  console.log('Request body:', req.body);
  console.log('Login attempt:', req.body.username);
  const { username, password } = req.body;
  try {
    console.log('Searching for user:', username);
    const user = await userModel.findUserByUsername(username);
    if (!user) {
      console.log('User not found:', username);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('User found. Comparing passwords...');
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ error: 'Invalid password' });
    }
    console.log('Password valid. Generating token...');
    const token = jwt.sign({ id: user.id, username: user.username }, 'secret', { expiresIn: '1h' });
    console.log('Token generated. Login successful for:', username);
    res.json({ token, level: user.level, points: user.points });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { username, password, level } = req.body;

    // Only admin can update other users or change level
    if (req.user.id !== userId && req.user.level !== 10) {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }

    // Non-admin users can only update their own password
    if (req.user.id === userId && req.user.level !== 10) {
      if (username !== undefined || level !== undefined) {
        return res.status(403).json({ error: 'Not authorized to change username or level' });
      }
    }

    const updatedUser = await userModel.updateUser(userId, { username, password, level });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Only admin can delete users
    if (req.user.level !== 10) {
      return res.status(403).json({ error: 'Not authorized to delete users' });
    }

    const deletedUser = await userModel.deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New function to allow users to change their own password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get the current user
    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    const updatedUser = await userModel.updateUser(userId, { password: newPassword });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New function to allow admins to change any user's password
const changeUserPassword = async (req, res) => {
  try {
    // Only admin can change other users' passwords
    if (req.user.level !== 10) {
      return res.status(403).json({ error: 'Not authorized to change user passwords' });
    }

    const userId = parseInt(req.params.userId);
    const { newPassword } = req.body;

    // Update password
    const updatedUser = await userModel.updateUser(userId, { password: newPassword });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New function to allow admins to create users
const createUserByAdmin = async (req, res) => {
  try {
    // Only admin can create users
    if (req.user.level !== 10) {
      return res.status(403).json({ error: 'Not authorized to create users' });
    }

    const { username, password, level } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if user already exists
    const existingUser = await userModel.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create the new user
    const newUser = await userModel.createUser(username, password, level || 1);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
  getCurrentUser,
  changePassword, // Export the new function
  changeUserPassword, // Export the new function
  createUserByAdmin, // Export the new function
};