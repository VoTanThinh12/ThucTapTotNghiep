import { pool } from '../config/database.js';

export const getAllPitches = async (req, res) => {
  try {
    const { pitch_type, status = 'active', search } = req.query;
    
    let query = 'SELECT * FROM pitches WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (pitch_type) {
      query += ' AND pitch_type = ?';
      params.push(pitch_type);
    }

    if (search) {
      query += ' AND (name LIKE ? OR location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [pitches] = await pool.query(query, params);

    // Get time slots for each pitch
    for (let pitch of pitches) {
      const [timeSlots] = await pool.query(
        'SELECT * FROM time_slots WHERE pitch_id = ? AND is_available = 1 ORDER BY start_time',
        [pitch.id]
      );
      pitch.time_slots = timeSlots;
    }

    res.json({ 
      success: true,
      count: pitches.length,
      pitches 
    });

  } catch (error) {
    console.error('Get pitches error:', error);
    res.status(500).json({ message: 'Lấy danh sách sân thất bại' });
  }
};

export const getPitchById = async (req, res) => {
  try {
    const { id } = req.params;

    const [pitches] = await pool.query(
      'SELECT * FROM pitches WHERE id = ?', 
      [id]
    );

    if (pitches.length === 0) {
      return res.status(404).json({ message: 'Sân không tồn tại' });
    }

    const pitch = pitches[0];

    // Get time slots
    const [timeSlots] = await pool.query(
      'SELECT * FROM time_slots WHERE pitch_id = ? AND is_available = 1 ORDER BY start_time',
      [id]
    );

    pitch.time_slots = timeSlots;

    res.json({ 
      success: true,
      pitch 
    });

  } catch (error) {
    console.error('Get pitch error:', error);
    res.status(500).json({ message: 'Lấy thông tin sân thất bại' });
  }
};

export const getPitchTimeSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    // Get pitch info
    const [pitches] = await pool.query(
      'SELECT * FROM pitches WHERE id = ? AND status = ?',
      [id, 'active']
    );

    if (pitches.length === 0) {
      return res.status(404).json({ message: 'Sân không tồn tại hoặc không hoạt động' });
    }

    // Get all time slots for this pitch
    const [timeSlots] = await pool.query(
      'SELECT * FROM time_slots WHERE pitch_id = ? AND is_available = 1 ORDER BY start_time',
      [id]
    );

    // If date is provided, check which slots are already booked
    let bookedTimeSlotIds = [];
    if (date) {
      const [bookings] = await pool.query(
        `SELECT time_slot_id FROM bookings 
         WHERE pitch_id = ? AND booking_date = ? 
         AND booking_status NOT IN ('cancelled')`,
        [id, date]
      );
      bookedTimeSlotIds = bookings.map(b => b.time_slot_id);
    }

    // Mark slots as available or booked
    const slotsWithAvailability = timeSlots.map(slot => ({
      ...slot,
      is_booked: date ? bookedTimeSlotIds.includes(slot.id) : false
    }));

    res.json({
      success: true,
      pitch_id: id,
      date: date || null,
      time_slots: slotsWithAvailability
    });

  } catch (error) {
    console.error('Get pitch time slots error:', error);
    res.status(500).json({ message: 'Lấy khung giờ thất bại' });
  }
};

export const createPitch = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      name, pitch_type, location, description, rules,
      open_time, close_time, max_capacity,
      time_slots, image_url
    } = req.body;

    await connection.beginTransaction();

    // Insert pitch
    const [result] = await connection.query(
      `INSERT INTO pitches (name, pitch_type, location, description, rules, 
       open_time, close_time, max_capacity, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, pitch_type, location, 
        description || null, 
        rules || null, 
        open_time, close_time,
        max_capacity || null,
        image_url || null,
        'active'
      ]
    );

    const pitchId = result.insertId;

    // Insert time slots
    if (time_slots && Array.isArray(time_slots)) {
      for (const slot of time_slots) {
        await connection.query(
          'INSERT INTO time_slots (pitch_id, slot_name, start_time, end_time, price, is_available) VALUES (?, ?, ?, ?, ?, ?)',
          [pitchId, slot.slot_name, slot.start_time, slot.end_time, slot.price, 1]
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Tạo sân thành công',
      pitch: { id: pitchId, ...req.body }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create pitch error:', error);
    res.status(500).json({ 
      message: 'Tạo sân thất bại', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

export const updatePitch = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if pitch exists
    const [existing] = await connection.query(
      'SELECT id FROM pitches WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Sân không tồn tại' });
    }

    await connection.beginTransaction();

    // Update pitch fields
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (key !== 'time_slots' && updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length > 0) {
      values.push(id);
      await connection.query(
        `UPDATE pitches SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Update time slots if provided
    if (updates.time_slots && Array.isArray(updates.time_slots)) {
      // Delete old time slots
      await connection.query('DELETE FROM time_slots WHERE pitch_id = ?', [id]);
      
      // Insert new time slots
      for (const slot of updates.time_slots) {
        await connection.query(
          'INSERT INTO time_slots (pitch_id, slot_name, start_time, end_time, price, is_available) VALUES (?, ?, ?, ?, ?, ?)',
          [id, slot.slot_name, slot.start_time, slot.end_time, slot.price, slot.is_available || 1]
        );
      }
    }

    await connection.commit();

    res.json({ 
      success: true,
      message: 'Cập nhật sân thành công' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Update pitch error:', error);
    res.status(500).json({ message: 'Cập nhật sân thất bại' });
  } finally {
    connection.release();
  }
};

export const deletePitch = async (req, res) => {
  try {
    const { id } = req.params;

    // Check for existing bookings
    const [bookings] = await pool.query(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE pitch_id = ? AND booking_status NOT IN ('cancelled', 'completed')`,
      [id]
    );

    if (bookings[0].count > 0) {
      return res.status(400).json({ 
        message: 'Không thể xóa sân có booking đang hoạt động' 
      });
    }

    await pool.query('DELETE FROM pitches WHERE id = ?', [id]);

    res.json({ 
      success: true,
      message: 'Xóa sân thành công' 
    });

  } catch (error) {
    console.error('Delete pitch error:', error);
    res.status(500).json({ message: 'Xóa sân thất bại' });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { pitch_id, date } = req.query;

    if (!pitch_id || !date) {
      return res.status(400).json({ 
        message: 'Thiếu pitch_id hoặc date' 
      });
    }

    // Get pitch info
    const [pitches] = await pool.query(
      'SELECT * FROM pitches WHERE id = ? AND status = ?', 
      [pitch_id, 'active']
    );
    
    if (pitches.length === 0) {
      return res.status(404).json({ message: 'Sân không tồn tại hoặc không hoạt động' });
    }

    const pitch = pitches[0];

    // Get booked time slot IDs
    const [bookings] = await pool.query(
      `SELECT time_slot_id FROM bookings 
       WHERE pitch_id = ? AND booking_date = ? 
       AND booking_status NOT IN ('cancelled')`,
      [pitch_id, date]
    );

    const bookedTimeSlotIds = bookings.map(b => b.time_slot_id);

    // Get time slots
    const [timeSlots] = await pool.query(
      'SELECT * FROM time_slots WHERE pitch_id = ? AND is_available = 1 ORDER BY start_time',
      [pitch_id]
    );

    // Mark which slots are booked
    const slotsWithAvailability = timeSlots.map(slot => ({
      ...slot,
      is_booked: bookedTimeSlotIds.includes(slot.id)
    }));

    res.json({
      success: true,
      pitch,
      time_slots: slotsWithAvailability,
      date
    });

  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ message: 'Lấy thông tin thất bại' });
  }
};