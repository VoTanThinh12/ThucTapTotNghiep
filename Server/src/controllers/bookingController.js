import { pool } from '../config/database.js';
import { format, addHours, parseISO } from 'date-fns';

export const getAllBookings = async (req, res) => {
  try {
    const { status, pitch_id, customer_id, date_from, date_to, page = 1, limit = 20 } = req.query;
    
    let query = `
      SELECT b.*, 
             p.name as pitch_name, p.type as pitch_type, p.location as pitch_location,
             c.name as customer_name, c.phone as customer_phone, c.email as customer_email,
             u.username
      FROM bookings b
      INNER JOIN pitches p ON b.pitch_id = p.id
      INNER JOIN customers c ON b.customer_id = c.id
      INNER JOIN users u ON c.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    // Filters
    if (status) {
      query += ' AND b.status = ?';
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
    query += ' ORDER BY b.booking_date DESC, b.start_time DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [bookings] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM bookings b WHERE 1=1';
    const countParams = [];
    
    if (status) {
      countQuery += ' AND b.status = ?';
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
              p.name as pitch_name, p.type as pitch_type, p.location as pitch_location,
              p.open_time, p.close_time,
              c.name as customer_name, c.phone as customer_phone, c.email as customer_email,
              u.username, u.full_name
       FROM bookings b
       INNER JOIN pitches p ON b.pitch_id = p.id
       INNER JOIN customers c ON b.customer_id = c.id
       INNER JOIN users u ON c.user_id = u.id
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
    const { pitch_id, booking_date, start_time, duration, notes } = req.body;
    const userId = req.user.id;

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

    // Check time slot availability
    const [conflicts] = await connection.query(
      `SELECT id FROM bookings 
       WHERE pitch_id = ? 
       AND booking_date = ? 
       AND start_time = ?
       AND status NOT IN ('cancelled')`,
      [pitch_id, booking_date, start_time]
    );

    if (conflicts.length > 0) {
      return res.status(400).json({ 
        message: 'Khung giờ này đã được đặt' 
      });
    }

    // Calculate price based on time slot
    const [priceSlots] = await connection.query(
      'SELECT price FROM price_slots WHERE pitch_id = ? AND time_slot = ?',
      [pitch_id, start_time.substring(0, 5)]
    );

    let total_price;
    if (priceSlots.length > 0) {
      total_price = priceSlots[0].price * duration;
    } else {
      // Use average price if no specific slot
      total_price = ((pitch.min_price + pitch.max_price) / 2) * duration;
    }

    await connection.beginTransaction();

    // Create booking
    const [result] = await connection.query(
      `INSERT INTO bookings 
       (pitch_id, customer_id, booking_date, start_time, duration, total_price, notes, status, deposit_paid)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [pitch_id, customer_id, booking_date, start_time, duration, total_price, notes || null, 'pending', 0]
    );

    const bookingId = result.insertId;

    // Update customer booking count
    await connection.query(
      'UPDATE customers SET booking_count = booking_count + 1 WHERE id = ?',
      [customer_id]
    );

    // Create notification
    await connection.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES (?, ?, ?, ?)`,
      [
        userId,
        'Đặt sân thành công',
        `Bạn đã đặt sân ${pitch.name} vào ${booking_date} lúc ${start_time}`,
        'booking'
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
        start_time,
        duration,
        total_price,
        status: 'pending'
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
    const { status, deposit_paid, notes } = req.body;

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

    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);

      // If completed, update customer total_spent
      if (status === 'completed') {
        await connection.query(
          'UPDATE customers SET total_spent = total_spent + ? WHERE id = ?',
          [booking.total_price, booking.customer_id]
        );
      }
    }

    if (deposit_paid !== undefined) {
      updates.push('deposit_paid = ?');
      values.push(deposit_paid);
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
    if (booking.status === 'completed') {
      return res.status(400).json({ 
        message: 'Không thể hủy booking đã hoàn thành' 
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ 
        message: 'Booking đã được hủy trước đó' 
      });
    }

    await connection.beginTransaction();

    // Update booking status
    await connection.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      ['cancelled', id]
    );

    // Decrease customer booking count
    await connection.query(
      'UPDATE customers SET booking_count = booking_count - 1 WHERE id = ?',
      [booking.customer_id]
    );

    // Create notification
    await connection.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES (?, ?, ?, ?)`,
      [
        booking.user_id,
        'Booking đã bị hủy',
        `Booking #${id} đã được hủy`,
        'booking'
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
             p.name as pitch_name, p.type as pitch_type, p.location as pitch_location,
             p.images as pitch_images
      FROM bookings b
      INNER JOIN pitches p ON b.pitch_id = p.id
      WHERE b.customer_id = ?
    `;
    const params = [customer_id];

    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }

    const offset = (page - 1) * limit;
    query += ' ORDER BY b.booking_date DESC, b.start_time DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [bookings] = await pool.query(query, params);

    // Parse images
    bookings.forEach(booking => {
      booking.pitch_images = booking.pitch_images ? JSON.parse(booking.pitch_images) : [];
    });

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE customer_id = ?';
    const countParams = [customer_id];
    
    if (status) {
      countQuery += ' AND status = ?';
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
      `SELECT status, COUNT(*) as count, SUM(total_price) as revenue
       FROM bookings ${dateFilter}
       GROUP BY status`,
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
