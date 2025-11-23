// ================================================================
// SERVICE CONTROLLER - Quản lý dịch vụ bổ sung
// ================================================================

const db = require('../config/database');

// @desc    Lấy danh sách dịch vụ
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const [services] = await db.query(
      'SELECT * FROM services WHERE status = "active" ORDER BY category, name'
    );

    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Tạo dịch vụ mới (Admin)
// @route   POST /api/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    const { name, description, price, unit, category } = req.body;

    const [result] = await db.query(
      'INSERT INTO services (name, description, price, unit, category, status) VALUES (?, ?, ?, ?, ?, "active")',
      [name, description, price, unit, category]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo dịch vụ thành công',
      serviceId: result.insertId
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Cập nhật dịch vụ (Admin)
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = async (req, res) => {
  try {
    const { name, description, price, unit, category, status } = req.body;

    const [result] = await db.query(
      'UPDATE services SET name=?, description=?, price=?, unit=?, category=?, status=? WHERE id=?',
      [name, description, price, unit, category, status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật dịch vụ thành công'
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};
