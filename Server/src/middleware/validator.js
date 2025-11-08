import { body, param, query, validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  };
};

// Auth Validations
export const authValidation = {
  register: [
    body('username')
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Username phải từ 3-50 ký tự')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username chỉ chứa chữ, số và dấu gạch dưới'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password tối thiểu 6 ký tự'),
    body('full_name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Họ tên phải từ 2-100 ký tự'),
    body('phone')
      .optional()
      .matches(/^[0-9]{10,11}$/)
      .withMessage('Số điện thoại không hợp lệ'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Email không hợp lệ')
  ],
  login: [
    body('username').trim().notEmpty().withMessage('Username là bắt buộc'),
    body('password').notEmpty().withMessage('Password là bắt buộc')
  ]
};

// Pitch Validations
export const pitchValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('Tên sân là bắt buộc'),
    body('type').isIn(['5v5', '7v7']).withMessage('Loại sân phải là 5v5 hoặc 7v7'),
    body('location').trim().notEmpty().withMessage('Địa chỉ là bắt buộc'),
    body('open_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Giờ mở cửa không hợp lệ'),
    body('close_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Giờ đóng cửa không hợp lệ'),
    body('min_price').isFloat({ min: 0 }).withMessage('Giá tối thiểu phải >= 0'),
    body('max_price').isFloat({ min: 0 }).withMessage('Giá tối đa phải >= 0')
  ],
  update: [
    param('id').isInt().withMessage('ID sân không hợp lệ')
  ]
};

// Booking Validations
export const bookingValidation = {
  create: [
    body('pitch_id').isInt().withMessage('Pitch ID phải là số nguyên'),
    body('booking_date')
      .isDate({ format: 'YYYY-MM-DD' })
      .withMessage('Ngày đặt không hợp lệ (YYYY-MM-DD)')
      .custom((value) => {
        const bookingDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (bookingDate < today) {
          throw new Error('Không thể đặt sân cho ngày trong quá khứ');
        }
        return true;
      }),
    body('start_time')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Thời gian không hợp lệ (HH:MM)'),
    body('duration')
      .isFloat({ min: 0.5, max: 24 })
      .withMessage('Thời lượng phải từ 0.5 đến 24 giờ')
  ],
  update: [
    param('id').isInt().withMessage('ID booking không hợp lệ'),
    body('status')
      .optional()
      .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
      .withMessage('Status không hợp lệ')
  ]
};
