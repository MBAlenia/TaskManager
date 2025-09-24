const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createErrorResponse, handleDatabaseError, validateInput } = require('../utils/errorHandler');

const register = async (req, res) => {
  console.log('Register attempt:', req.body.username);
  
  // Validate input
  const validationError = validateInput(req.body, {
    username: { required: true, type: 'string', minLength: 3, maxLength: 50 },
    password: { required: true, type: 'string', minLength: 6, maxLength: 100 },
    level: { type: 'number', min: 1, max: 10 }
  });
  
  if (validationError) {
    return res.status(400).json(validationError);
  }
  
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
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const login = async (req, res) => {
  console.log('Login request received.');
  console.log('Request body:', req.body);
  console.log('Login attempt:', req.body.username);
  
  // Validate input
  const validationError = validateInput(req.body, {
    username: { required: true, type: 'string', minLength: 1 },
    password: { required: true, type: 'string', minLength: 1 }
  });
  
  if (validationError) {
    return res.status(400).json(validationError);
  }
  
  const { username, password } = req.body;
  try {
    console.log('Searching for user:', username);
    const user = await userModel.findUserByUsername(username);
    if (!user) {
      console.log('User not found:', username);
      return res.status(404).json(createErrorResponse(404, 'User not found'));
    }
    console.log('User found. Comparing passwords...');
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('Invalid password for user:', username);
      return res.status(401).json(createErrorResponse(401, 'Invalid password'));
    }
    console.log('Password valid. Generating token...');
    const token = jwt.sign({ id: user.id, username: user.username }, 'secret', { expiresIn: '1h' });
    console.log('Token generated. Login successful for:', username);
    res.json({ token, level: user.level, points: user.points });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(createErrorResponse(500, 'Internal server error'));
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { username, password, level } = req.body;

    // Validate user ID
    if (isNaN(userId)) {
      return res.status(400).json(createErrorResponse(400, 'Invalid user ID'));
    }

    // Only admin can update other users or change level
    if (req.user.id !== userId && req.user.level !== 10) {
      return res.status(403).json(createErrorResponse(403, 'Not authorized to update this user'));
    }

    // Non-admin users can only update their own password
    if (req.user.id === userId && req.user.level !== 10) {
      if (username !== undefined || level !== undefined) {
        return res.status(403).json(createErrorResponse(403, 'Not authorized to change username or level'));
      }
    }

    const updatedUser = await userModel.updateUser(userId, { username, password, level });
    if (!updatedUser) {
      return res.status(404).json(createErrorResponse(404, 'User not found'));
    }
    res.json(updatedUser);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Validate user ID
    if (isNaN(userId)) {
      return res.status(400).json(createErrorResponse(400, 'Invalid user ID'));
    }

    // Only admin can delete users
    if (req.user.level !== 10) {
      return res.status(403).json(createErrorResponse(403, 'Not authorized to delete users'));
    }

    const deletedUser = await userModel.deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).json(createErrorResponse(404, 'User not found'));
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json(createErrorResponse(404, 'User not found'));
    }
    res.json(user);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

// New function to allow users to change their own password
const changePassword = async (req, res) => {
  try {
    // Validate input
    const validationError = validateInput(req.body, {
      currentPassword: { required: true, type: 'string', minLength: 1 },
      newPassword: { required: true, type: 'string', minLength: 6, maxLength: 100 }
    });
    
    if (validationError) {
      return res.status(400).json(validationError);
    }
    
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get the current user
    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json(createErrorResponse(404, 'User not found'));
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json(createErrorResponse(401, 'Current password is incorrect'));
    }

    // Update password
    const updatedUser = await userModel.updateUser(userId, { password: newPassword });
    if (!updatedUser) {
      return res.status(404).json(createErrorResponse(404, 'User not found'));
    }

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

// New function to allow admins to change any user's password
const changeUserPassword = async (req, res) => {
  try {
    // Validate input
    const validationError = validateInput(req.body, {
      newPassword: { required: true, type: 'string', minLength: 6, maxLength: 100 }
    });
    
    if (validationError) {
      return res.status(400).json(validationError);
    }
    
    // Only admin can change other users' passwords
    if (req.user.level !== 10) {
      return res.status(403).json(createErrorResponse(403, 'Not authorized to change user passwords'));
    }

    const userId = parseInt(req.params.userId);
    
    // Validate user ID
    if (isNaN(userId)) {
      return res.status(400).json(createErrorResponse(400, 'Invalid user ID'));
    }

    // Update password
    const updatedUser = await userModel.updateUser(userId, { password: req.body.newPassword });
    if (!updatedUser) {
      return res.status(404).json(createErrorResponse(404, 'User not found'));
    }

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
  }
};

// New function to allow admins to create users
const createUserByAdmin = async (req, res) => {
  try {
    // Only admin can create users
    if (req.user.level !== 10) {
      return res.status(403).json(createErrorResponse(403, 'Not authorized to create users'));
    }

    // Validate input
    const validationError = validateInput(req.body, {
      username: { required: true, type: 'string', minLength: 3, maxLength: 50 },
      password: { required: true, type: 'string', minLength: 6, maxLength: 100 },
      level: { type: 'number', min: 1, max: 10 }
    });
    
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const { username, password, level } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json(createErrorResponse(400, 'User already exists'));
    }

    // Create the new user
    const newUser = await userModel.createUser(username, password, level || 1);
    res.status(201).json(newUser);
  } catch (error) {
    const dbError = handleDatabaseError(error);
    res.status(dbError.status).json(dbError);
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