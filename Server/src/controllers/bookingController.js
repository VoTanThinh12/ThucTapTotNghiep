const bookingService = require('../services/bookingService');
const db = require('../config/database');

exports.createBooking = async (req, res) => {
  try {
    const { pitchId, customerName, phone, email, date, startTime, duration, note } = req.body;

    // Validate input
    if (!pitchId || !customerName || !phone || !date || !startTime || !duration) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    // Tìm hoặc tạo customer
    let [customer] = await db.query('SELECT id FROM customers WHERE phone = ?', [phone]);
    
    if (customer.length === 0) {
      const [result] = await db.query(
        'INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)',
        [customerName, phone, email || null]
      );
      customer = [{ id: result.insertId }];
    }

    const customerId = customer[0].id;

    // Tính giá
    const totalPrice = await bookingService.calculatePrice(pitchId, startTime, duration);

    // Tạo booking
    const bookingId = await bookingService.createBooking({
      pitchId,
      customerId,
      date,
      startTime,
      duration,
      totalPrice,
      note
    });

    res.status(201).json({
      message: 'Đặt sân thành công',
      data: { id: bookingId, totalPrice }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { status, date, pitchId } = req.query;
    
    let query = `
      SELECT 
        b.*,
        p.name as pitch_name,
        p.type as pitch_type,
        c.name as customer_name,
        c.phone as customer_phone
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      JOIN customers c ON b.customer_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }
    
    if (date) {
      query += ' AND b.booking_date = ?';
      params.push(date);
    }
    
    if (pitchId) {
      query += ' AND b.pitch_id = ?';
      params.push(pitchId);
    }
    
    query += ' ORDER BY b.booking_date DESC, b.start_time DESC';
    
    const [bookings] = await db.query(query, params);
    
    res.json({ data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [booking] = await db.query(`
      SELECT 
        b.*,
        p.name as pitch_name,
        p.location as pitch_location,
        p.type as pitch_type,
        c.name as customer_name,
        c.phone as customer_phone,
        c.email as customer_email
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      JOIN customers c ON b.customer_id = c.id
      WHERE b.id = ?
    `, [id]);
    
    if (booking.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn đặt' });
    }
    
    res.json({ data: booking[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updated = await bookingService.updateBookingStatus(id, status);
    
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy đơn đặt' });
    }
    
    // Cập nhật thống kê customer nếu completed
    if (status === 'completed') {
      await db.query(`
        UPDATE customers c
        JOIN bookings b ON c.id = b.customer_id
        SET 
          c.total_spent = c.total_spent + b.total_price,
          c.booking_count = c.booking_count + 1
        WHERE b.id = ?
      `, [id]);
    }
    
    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { pitchId, date, startTime, duration } = req.query;
    
    const available = await bookingService.checkAvailability(
      pitchId, date, startTime, parseFloat(duration)
    );
    
    res.json({ available });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.calculatePrice = async (req, res) => {
  try {
    const { pitchId, startTime, duration } = req.query;
    
    const price = await bookingService.calculatePrice(
      pitchId, startTime, parseFloat(duration)
    );
    
    res.json({ price });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
