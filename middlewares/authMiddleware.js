// Import necessary modules
const jwt = require('jsonwebtoken');
const config = require('../config'); // Import your configuration file where you store secret key and other configurations

// Authentication middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token missing.' });
    }
  
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtSecret);
      req.user = decoded; // assuming the decoded token directly contains user information
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ error: 'Access denied. Invalid token.' });
    }
  };
  

module.exports = authMiddleware;
