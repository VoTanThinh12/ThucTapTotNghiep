export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  // Validation Error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.errors
    });
  }

  // MySQL Duplicate Entry
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      message: 'Dữ liệu đã tồn tại trong hệ thống'
    });
  }

  // MySQL Foreign Key Constraint
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      message: 'Dữ liệu tham chiếu không tồn tại'
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token không hợp lệ'
    });
  }

  // Default Error
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};
