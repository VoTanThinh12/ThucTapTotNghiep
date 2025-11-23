// ================================================================
// PITCH CONTROLLER - Quản lý sân bóng
// ================================================================

const db = require('../config/database');

// @desc    Lấy danh sách sân bóng
// @route   GET /api/pitches
// @access  Public
exports.getPitches = async (req, res) => {
  try {
    const { type, location, status } = req.query;

    let query = 'SELECT * FROM pitches WHERE 1=1';
    const params = [];

    // Lọc theo loại sân
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    // Lọc theo địa điểm
    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    // Lọc theo trạng thái (mặc định chỉ lấy active)
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    } else {
      query += ' AND status = "active"';
    }

    query += ' ORDER BY created_at DESC';

    const [pitches] = await db.query(query, params);

    res.json({
      success: true,
      count: pitches.length,
      pitches
    });
  } catch (error) {
    console.error('Get pitches error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Lấy chi tiết sân bóng
// @route   GET /api/pitches/:id
// @access  Public
exports.getPitchById = async (req, res) => {
  try {
    const [pitches] = await db.query(
      'SELECT * FROM pitches WHERE id = ?',
      [req.params.id]
    );

    if (pitches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sân bóng'
      });
    }

    res.json({
      success: true,
      pitch: pitches[0]
    });
  } catch (error) {
    console.error('Get pitch error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Tạo sân bóng mới (Admin)
// @route   POST /api/pitches
// @access  Private/Admin
exports.createPitch = async (req, res) => {
  try {
    const {
      name,
      type,
      location,
      address,
      description,
      capacity,
      price_per_hour,
      facilities
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO pitches (name, type, location, address, description, capacity, price_per_hour, facilities, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        name,
        type,
        location,
        address,
        description,
        capacity,
        price_per_hour,
        JSON.stringify(facilities || [])
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo sân bóng thành công',
      pitchId: result.insertId
    });
  } catch (error) {
    console.error('Create pitch error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Cập nhật sân bóng (Admin)
// @route   PUT /api/pitches/:id
// @access  Private/Admin
exports.updatePitch = async (req, res) => {
  try {
    const {
      name,
      type,
      location,
      address,
      description,
      capacity,
      price_per_hour,
      facilities,
      status
    } = req.body;

    const [result] = await db.query(
      `UPDATE pitches 
       SET name=?, type=?, location=?, address=?, description=?, 
           capacity=?, price_per_hour=?, facilities=?, status=?
       WHERE id=?`,
      [
        name,
        type,
        location,
        address,
        description,
        capacity,
        price_per_hour,
        JSON.stringify(facilities || []),
        status,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sân bóng'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật sân bóng thành công'
    });
  } catch (error) {
    console.error('Update pitch error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Xóa sân bóng (Admin)
// @route   DELETE /api/pitches/:id
// @access  Private/Admin
exports.deletePitch = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM pitches WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sân bóng'
      });
    }

    res.json({
      success: true,
      message: 'Xóa sân bóng thành công'
    });
  } catch (error) {
    console.error('Delete pitch error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Lấy khung giờ của sân bóng
// @route   GET /api/pitches/:id/timeslots
// @access  Public
exports.getTimeslots = async (req, res) => {
  try {
    const { date } = req.query;

    const [timeslots] = await db.query(
      `SELECT * FROM timeslots 
       WHERE pitch_id = ? AND date = ? AND is_available = TRUE
       ORDER BY start_time`,
      [req.params.id, date]
    );

    res.json({
      success: true,
      count: timeslots.length,
      timeslots
    });
  } catch (error) {
    console.error('Get timeslots error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};
