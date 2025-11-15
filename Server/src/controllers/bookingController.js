import { pool } from '../config/database.js';
import { format, addHours, parseISO } from 'date-fns';

export const getAllBookings = async (req, res) => {
  try {
    const { status, pitch_id, customer_id, date_from, date_to, page = 1, limit = 20 } = req.query;
    
    let query = `
      SELECT b.*, 
             p.name as pitch_name, p.pitch_type as pitch_type, p.location as pitch_location,
             c.full_name as customer_name, c.phone as customer_phone, c.email as customer_email,
             u.username,
             ts.slot_name, ts.start_time as slot_start_time, ts.end_time as slot_end_time
      FROM bookings b
      INNER JOIN pitches p ON b.pitch_id = p.id
      INNER JOIN customers c ON b.customer_id = c.id
      INNER JOIN users u ON c.user_id = u.id
      INNER JOIN time_slots ts ON b.time_slot_id = ts.id
      WHERE 1=1
    `;
    const params = [];

    // Filters
    if (status) {
      query += ' AND b.booking_status = ?';
      params.push(status);
    }

    if (pitch_id) {
      query += ' AND b.pitch_id = ?';
      params.push(pitch_id);
    }

    if (customer_id) {
      query += ' AND b.customer_id = ?';
      params.push(customer_id);
    }

    if (date_from) {
      query += ' AND b.booking_date >= ?';
      params.push(date_from);
    }

    if (date_to) {
      query += ' AND b.booking_date <= ?';
      params.push(date_to);
    }

    // Pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY b.booking_date DESC, ts.start_time DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [bookings] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM bookings b WHERE 1=1';
    const countParams = [];
    
    if (status) {
      countQuery += ' AND b.booking_status = ?';
      countParams.push(status);
    }
    if (pitch_id) {
      countQuery += ' AND b.pitch_id = ?';
      countParams.push(pitch_id);
    }
    if (customer_id) {
      countQuery += ' AND b.customer_id = ?';
      countParams.push(customer_id);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Lấy danh sách booking thất bại' });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const [bookings] = await pool.query(
      `SELECT b.*, 
              p.name as pitch_name, p.pitch_type as pitch_type, p.location as pitch_location,
              p.open_time, p.close_time,
              c.full_name as customer_name, c.phone as customer_phone, c.email as customer_email,
              u.username, u.full_name,
              ts.slot_name, ts.start_time as slot_start_time, ts.end_time as slot_end_time, ts.price as slot_price
       FROM bookings b
       INNER JOIN pitches p ON b.pitch_id = p.id
       INNER JOIN customers c ON b.customer_id = c.id
       INNER JOIN users u ON c.user_id = u.id
       INNER JOIN time_slots ts ON b.time_slot_id = ts.id
       WHERE b.id = ?`,
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking không tồn tại' });
    }

    res.json({
      success: true,
      booking: bookings[0]
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Lấy thông tin booking thất bại' });
  }
};

export const createBooking = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { pitch_id, booking_date, time_slot_id, duration, notes, team_a_name, team_b_name } = req.body;
    const userId = req.user.id;

    console.log('Received booking data:', { pitch_id, booking_date, time_slot_id, duration, notes });

    // Validate required fields
    if (!pitch_id || !booking_date || !time_slot_id) {
      return res.status(400).json({ 
        message: 'Thiếu thông tin: pitch_id, booking_date, time_slot_id là bắt buộc' 
      });
    }

    // Get customer_id from user_id
    const [customers] = await connection.query(
      'SELECT id FROM customers WHERE user_id = ?',
      [userId]
    );

    if (customers.length === 0) {
      return res.status(400).json({ message: 'Customer profile không tồn tại' });
    }

    const customer_id = customers[0].id;

    // Check pitch exists and active
    const [pitches] = await connection.query(
      'SELECT * FROM pitches WHERE id = ? AND status = ?',
      [pitch_id, 'active']
    );

    if (pitches.length === 0) {
      return res.status(404).json({ message: 'Sân không tồn tại hoặc không hoạt động' });
    }

    const pitch = pitches[0];

    // Get time slot info and price
    const [timeSlots] = await connection.query(
      'SELECT * FROM time_slots WHERE id = ? AND pitch_id = ? AND is_available = 1',
      [time_slot_id, pitch_id]
    );

    if (timeSlots.length === 0) {
      return res.status(404).json({ 
        message: 'Khung giờ không tồn tại hoặc không khả dụng cho sân này' 
      });
    }

    const timeSlot = timeSlots[0];
    console.log('Time slot found:', timeSlot);

    // Check time slot availability for this date
    const [conflicts] = await connection.query(
      `SELECT id FROM bookings 
       WHERE pitch_id = ? 
       AND booking_date = ? 
       AND time_slot_id = ?
       AND booking_status NOT IN ('cancelled')`,
      [pitch_id, booking_date, time_slot_id]
    );

    if (conflicts.length > 0) {
      return res.status(400).json({ 
        message: 'Khung giờ này đã được đặt cho ngày này' 
      });
    }

    // Calculate total price
    // Price from time_slot * duration (if duration is in hours)
    // If duration is not provided or invalid, use 1 as default
    const bookingDuration = duration && !isNaN(duration) && duration > 0 ? parseFloat(duration) : 1;
    const slotPrice = parseFloat(timeSlot.price);
    
    if (isNaN(slotPrice)) {
      console.error('Invalid slot price:', timeSlot.price);
      return res.status(500).json({ 
        message: 'Giá khung giờ không hợp lệ' 
      });
    }

    const total_price = slotPrice * bookingDuration;
    const remaining_payment = total_price; // Initially, all payment is remaining

    console.log('Price calculation:', { 
      slotPrice, 
      bookingDuration, 
      total_price, 
      remaining_payment 
    });

    await connection.beginTransaction();

    // Create booking
    const [result] = await connection.query(
      `INSERT INTO bookings 
       (pitch_id, customer_id, booking_date, time_slot_id, duration, total_price, 
        deposit_paid, remaining_payment, payment_status, booking_status, 
        team_a_name, team_b_name, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pitch_id, 
        customer_id, 
        booking_date, 
        time_slot_id, 
        bookingDuration,
        total_price, 
        0, // deposit_paid
        remaining_payment,
        'unpaid', // payment_status
        'pending', // booking_status
        team_a_name || null,
        team_b_name || null,
        notes || null
      ]
    );

    const bookingId = result.insertId;

    // Update customer booking count
    await connection.query(
      'UPDATE customers SET total_bookings = total_bookings + 1 WHERE id = ?',
      [customer_id]
    );

    // Create notification
    await connection.query(
      `INSERT INTO notifications (user_id, title, message, type, related_booking_id)
       VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        'Đặt sân thành công',
        `Bạn đã đặt sân ${pitch.name} vào ${booking_date} - ${timeSlot.slot_name}`,
        'booking',
        bookingId
      ]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Đặt sân thành công',
      booking: {
        id: bookingId,
        pitch_id,
        booking_date,
        time_slot_id,
        duration: bookingDuration,
        total_price,
        booking_status: 'pending',
        payment_status: 'unpaid'
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create booking error:', error);
    res.status(500).json({ 
      message: 'Đặt sân thất bại', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

export const updateBooking = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { booking_status, payment_status, deposit_paid, notes } = req.body;

    // Get booking info
    const [bookings] = await connection.query(
      'SELECT * FROM bookings WHERE id = ?',
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking không tồn tại' });
    }

    const booking = bookings[0];

    await connection.beginTransaction();

    // Update booking
    const updates = [];
    const values = [];

    if (booking_status !== undefined) {
      updates.push('booking_status = ?');
      values.push(booking_status);

      // If completed, update customer total_spent
      if (booking_status === 'completed') {
        await connection.query(
          'UPDATE customers SET total_spent = total_spent + ? WHERE id = ?',
          [booking.total_price, booking.customer_id]
        );
      }
    }

    if (payment_status !== undefined) {
      updates.push('payment_status = ?');
      values.push(payment_status);
    }

    if (deposit_paid !== undefined) {
      const depositAmount = parseFloat(deposit_paid);
      updates.push('deposit_paid = ?');
      values.push(depositAmount);
      
      // Update remaining payment
      const remaining = booking.total_price - depositAmount;
      updates.push('remaining_payment = ?');
      values.push(remaining);
    }

    if (notes !== undefined) {
      updates.push('notes = ?');
      values.push(notes);
    }

    if (updates.length > 0) {
      values.push(id);
      await connection.query(
        `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Cập nhật booking thành công'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Cập nhật booking thất bại' });
  } finally {
    connection.release();
  }
};

export const cancelBooking = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get booking with customer info
    const [bookings] = await connection.query(
      `SELECT b.*, c.user_id 
       FROM bookings b
       INNER JOIN customers c ON b.customer_id = c.id
       WHERE b.id = ?`,
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking không tồn tại' });
    }

    const booking = bookings[0];

    // Check permission (only owner or admin can cancel)
    if (req.user.role !== 'admin' && booking.user_id !== userId) {
      return res.status(403).json({ 
        message: 'Không có quyền hủy booking này' 
      });
    }

    // Check if booking can be cancelled
    if (booking.booking_status === 'completed') {
      return res.status(400).json({ 
        message: 'Không thể hủy booking đã hoàn thành' 
      });
    }

    if (booking.booking_status === 'cancelled') {
      return res.status(400).json({ 
        message: 'Booking đã được hủy trước đó' 
      });
    }

    await connection.beginTransaction();

    // Update booking status
    await connection.query(
      'UPDATE bookings SET booking_status = ? WHERE id = ?',
      ['cancelled', id]
    );

    // Decrease customer booking count
    await connection.query(
      'UPDATE customers SET total_bookings = total_bookings - 1 WHERE id = ?',
      [booking.customer_id]
    );

    // Create notification
    await connection.query(
      `INSERT INTO notifications (user_id, title, message, type, related_booking_id)
       VALUES (?, ?, ?, ?, ?)`,
      [
        booking.user_id,
        'Booking đã bị hủy',
        `Booking #${id} đã được hủy`,
        'booking',
        id
      ]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Hủy booking thành công'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Hủy booking thất bại' });
  } finally {
    connection.release();
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    // Get customer_id
    const [customers] = await pool.query(
      'SELECT id FROM customers WHERE user_id = ?',
      [userId]
    );

    if (customers.length === 0) {
      return res.json({ success: true, bookings: [], pagination: {} });
    }

    const customer_id = customers[0].id;

    let query = `
      SELECT b.*, 
             p.name as pitch_name, p.pitch_type as pitch_type, p.location as pitch_location,
             p.image_url as pitch_image,
             ts.slot_name, ts.start_time as slot_start_time, ts.end_time as slot_end_time
      FROM bookings b
      INNER JOIN pitches p ON b.pitch_id = p.id
      INNER JOIN time_slots ts ON b.time_slot_id = ts.id
      WHERE b.customer_id = ?
    `;
    const params = [customer_id];

    if (status) {
      query += ' AND b.booking_status = ?';
      params.push(status);
    }

    const offset = (page - 1) * limit;
    query += ' ORDER BY b.booking_date DESC, ts.start_time DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [bookings] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE customer_id = ?';
    const countParams = [customer_id];
    
    if (status) {
      countQuery += ' AND booking_status = ?';
      countParams.push(status);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Lấy danh sách booking thất bại' });
  }
};

export const getBookingStats = async (req, res) => {
  try {
    const { date_from, date_to } = req.query;

    let dateFilter = '';
    const params = [];

    if (date_from && date_to) {
      dateFilter = 'WHERE booking_date BETWEEN ? AND ?';
      params.push(date_from, date_to);
    }

    // Total bookings by status
    const [statusStats] = await pool.query(
      `SELECT booking_status, COUNT(*) as count, SUM(total_price) as revenue
       FROM bookings ${dateFilter}
       GROUP BY booking_status`,
      params
    );

    // Bookings by pitch
    const [pitchStats] = await pool.query(
      `SELECT p.id, p.name, COUNT(b.id) as booking_count, 
              SUM(b.total_price) as revenue
       FROM pitches p
       LEFT JOIN bookings b ON p.id = b.pitch_id ${dateFilter ? 'AND b.booking_date BETWEEN ? AND ?' : ''}
       GROUP BY p.id, p.name
       ORDER BY booking_count DESC`,
      params
    );

    // Daily bookings
    const [dailyStats] = await pool.query(
      `SELECT booking_date, COUNT(*) as count, SUM(total_price) as revenue
       FROM bookings ${dateFilter}
       GROUP BY booking_date
       ORDER BY booking_date`,
      params
    );

    res.json({
      success: true,
      stats: {
        by_status: statusStats,
        by_pitch: pitchStats,
        daily: dailyStats
      }
    });

  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({ message: 'Lấy thống kê thất bại' });
  }
};