// ================================================================
// ERROR HANDLER MIDDLEWARE
// ================================================================

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // MySQL duplicate key error
  if (err.code === 'ER_DUP_ENTRY') {
    const message = 'Duplicate field value entered';
    error = { statusCode: 400, message };
  }

  // MySQL foreign key constraint error
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    const message = 'Referenced resource not found';
    error = { statusCode: 404, message };
  }

  // MySQL validation error
  if (err.code === 'ER_BAD_NULL_ERROR') {
    const message = 'Required field is missing';
    error = { statusCode: 400, message };
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { statusCode: 401, message };
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { statusCode: 401, message };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
