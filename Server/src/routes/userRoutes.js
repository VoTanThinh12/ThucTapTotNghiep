// ================================================================
// USER ROUTES - Quản lý người dùng
// ================================================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { protect, authorize } = require('../middlewares/auth');

// @desc    Lấy danh sách user (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, full_name, email, phone, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @desc    Cập nhật profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { full_name, phone, address } = req.body;

    await db.query(
      'UPDATE users SET full_name=?, phone=?, address=? WHERE id=?',
      [full_name, phone, address, req.user.id]
    );

    res.json({
      success: true,
      message: 'Cập nhật profile thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

module.exports = router;
