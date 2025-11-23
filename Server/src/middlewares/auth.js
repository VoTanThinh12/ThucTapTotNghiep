// ================================================================
// AUTHENTICATION MIDDLEWARE - JWT Verification
// ================================================================

const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Verify JWT Token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const [rows] = await db.query(
        'SELECT id, full_name, email, role FROM users WHERE id = ? AND is_active = TRUE',
        [decoded.id]
      );

      if (rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists'
        });
      }

      // Add user to request object
      req.user = rows[0];
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Restrict to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
