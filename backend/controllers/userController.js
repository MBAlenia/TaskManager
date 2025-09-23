
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  console.log('Register attempt:', req.body.username);
  const { username, password, level } = req.body;
  try {
    const user = await userModel.createUser(username, password, level);
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
    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
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
    const userId = parseInt(req.params.id);
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
    const userId = parseInt(req.params.id);

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

module.exports = {
  register,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
  getCurrentUser,
};
