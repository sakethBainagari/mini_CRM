const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Basic authentication middleware
const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
      errors: [{ field: 'auth', message: 'Authentication token required' }]
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        errors: [{ field: 'auth', message: 'User associated with token not found' }]
      });
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        errors: [{ field: 'auth', message: 'Authentication token has expired' }]
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      errors: [{ field: 'auth', message: 'Invalid authentication token' }]
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        errors: [{ field: 'auth', message: 'User not authenticated' }]
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        errors: [{ field: 'auth', message: `Access denied. Required roles: ${roles.join(', ')}` }]
      });
    }

    next();
  };
};

// Admin only middleware
const adminOnly = authorize('admin');

// User or Admin middleware
const userOrAdmin = authorize('user', 'admin');

module.exports = {
  auth,
  authorize,
  adminOnly,
  userOrAdmin
};
