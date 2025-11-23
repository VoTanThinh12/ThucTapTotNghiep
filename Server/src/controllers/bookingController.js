// ================================================================
// BOOKING CONTROLLER - Quản lý đặt sân
// ================================================================

const db = require('../config/database');

// @desc    Tạo đơn đặt sân mới
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const {
      pitch_id,
      timeslot_id,
      booking_date,
      start_time,
      end_time,
      customer_name,
      customer_phone,
      customer_email,
      notes,
      services // Array: [{ service_id, quantity }]
    } = req.body;

    const user_id = req.user.id;

    // 1. Kiểm tra timeslot còn available không
    const [timeslots] = await db.query(
      'SELECT * FROM timeslots WHERE id = ? AND is_available = TRUE',
      [timeslot_id]
    );

    if (timeslots.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Khung giờ này đã được đặt'
      });
    }

    // 2. Tính tổng tiền
    const timeslot = timeslots[0];
    let total_price = parseFloat(timeslot.price);

    // Tính tiền dịch vụ
    if (services && services.length > 0) {
      for (const service of services) {
        const [serviceData] = await db.query(
          'SELECT price FROM services WHERE id = ?',
          [service.service_id]
        );
        if (serviceData.length > 0) {
          total_price += parseFloat(serviceData[0].price) * service.quantity;
        }
      }
    }

    // 3. Tạo mã đơn đặt
    const booking_code = 'BK' + Date.now().toString().slice(-8);

    // 4. Insert booking
    const [result] = await db.query(
      `INSERT INTO bookings 
       (booking_code, user_id, pitch_id, timeslot_id, booking_date, start_time, end_time, 
        total_price, customer_name, customer_phone, customer_email, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        booking_code,
        user_id,
        pitch_id,
        timeslot_id,
        booking_date,
        start_time,
        end_time,
        total_price,
        customer_name,
        customer_phone,
        customer_email,
        notes
      ]
    );

    const booking_id = result.insertId;

    // 5. Insert booking services
    if (services && services.length > 0) {
      for (const service of services) {
        const [serviceData] = await db.query(
          'SELECT price FROM services WHERE id = ?',
          [service.service_id]
        );

        if (serviceData.length > 0) {
          const price = parseFloat(serviceData[0].price);
          const total = price * service.quantity;

          await db.query(
            'INSERT INTO booking_services (booking_id, service_id, quantity, price, total) VALUES (?, ?, ?, ?, ?)',
            [booking_id, service.service_id, service.quantity, price, total]
          );
        }
      }
    }

    // 6. Cập nhật timeslot thành không available
    await db.query(
      'UPDATE timeslots SET is_available = FALSE WHERE id = ?',
      [timeslot_id]
    );

    res.status(201).json({
      success: true,
      message: 'Đặt sân thành công',
      booking: {
        id: booking_id,
        booking_code,
        total_price
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Lấy danh sách đơn đặt
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user_role = req.user.role;

    let query = `
      SELECT b.*, p.name as pitch_name, p.type as pitch_type, p.location
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
    `;

    // Nếu là customer thì chỉ xem đơn của mình
    if (user_role === 'customer') {
      query += ' WHERE b.user_id = ?';
    }

    query += ' ORDER BY b.created_at DESC';

    const params = user_role === 'customer' ? [user_id] : [];
    const [bookings] = await db.query(query, params);

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Lấy chi tiết đơn đặt
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const [bookings] = await db.query(
      `SELECT b.*, p.name as pitch_name, p.type as pitch_type, p.location, p.address
       FROM bookings b
       JOIN pitches p ON b.pitch_id = p.id
       WHERE b.id = ?`,
      [req.params.id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn đặt'
      });
    }

    const booking = bookings[0];

    // Kiểm tra quyền xem (customer chỉ xem đơn của mình)
    if (req.user.role === 'customer' && booking.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập'
      });
    }

    // Lấy danh sách dịch vụ
    const [services] = await db.query(
      `SELECT bs.*, s.name as service_name
       FROM booking_services bs
       JOIN services s ON bs.service_id = s.id
       WHERE bs.booking_id = ?`,
      [req.params.id]
    );

    booking.services = services;

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Cập nhật trạng thái đơn đặt (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const [result] = await db.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn đặt'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công'
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Hủy đơn đặt
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const { cancellation_reason } = req.body;

    // Lấy thông tin đơn đặt
    const [bookings] = await db.query(
      'SELECT * FROM bookings WHERE id = ?',
      [req.params.id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn đặt'
      });
    }

    const booking = bookings[0];

    // Kiểm tra quyền (customer chỉ hủy đơn của mình)
    if (req.user.role === 'customer' && booking.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền hủy đơn này'
      });
    }

    // Cập nhật trạng thái
    await db.query(
      'UPDATE bookings SET status = "cancelled", cancellation_reason = ? WHERE id = ?',
      [cancellation_reason, req.params.id]
    );

    // Trả lại timeslot
    await db.query(
      'UPDATE timeslots SET is_available = TRUE WHERE id = ?',
      [booking.timeslot_id]
    );

    res.json({
      success: true,
      message: 'Hủy đơn đặt thành công'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};
