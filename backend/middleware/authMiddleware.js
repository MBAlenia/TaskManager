
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, 'secret');
      req.user = await userModel.findUserById(decoded.id); // Vous devrez ajouter findUserById au modèle utilisateur
      next();
    } catch (error) {
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
    if (req.user && req.user.level === 10) {
        next();
    } else {
        res.status(401).json({ error: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
