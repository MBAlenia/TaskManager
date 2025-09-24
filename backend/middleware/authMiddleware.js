const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { createErrorResponse, handleAuthError } = require('../utils/errorHandler');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, 'secret');
      req.user = await userModel.findUserById(decoded.id);
      if (!req.user) {
        return res.status(401).json(createErrorResponse(401, 'User not found'));
      }
      next();
    } catch (error) {
      const authError = handleAuthError(error);
      return res.status(authError.status).json(authError);
    }
  }

  if (!token) {
    return res.status(401).json(createErrorResponse(401, 'Not authorized, no token'));
  }
};

const admin = (req, res, next) => {
    if (req.user && req.user.level === 10) {
        next();
    } else {
        return res.status(401).json(createErrorResponse(401, 'Not authorized as an admin'));
    }
};

module.exports = { protect, admin };