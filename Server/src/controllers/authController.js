// ================================================================
// AUTH CONTROLLER - Xử lý đăng ký, đăng nhập
// ================================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// @desc    Đăng ký tài khoản mới
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const [existingUser] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, hashedPassword, phone, 'customer']
    );

    // Tạo JWT token
    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      token,
      user: {
        id: result.insertId,
        full_name,
        email,
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const user = users[0];

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, full_name, email, phone, address, role, avatar FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};
