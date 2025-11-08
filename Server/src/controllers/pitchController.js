import { pool } from '../config/database.js';

export const getAllPitches = async (req, res) => {
  try {
    const { type, status = 'active', search } = req.query;
    
    let query = 'SELECT * FROM pitches WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (search) {
      query += ' AND (name LIKE ? OR location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [pitches] = await pool.query(query, params);

    // Get price slots for each pitch
    for (let pitch of pitches) {
      const [priceSlots] = await pool.query(
        'SELECT * FROM price_slots WHERE pitch_id = ? ORDER BY time_slot',
        [pitch.id]
      );
      pitch.price_slots = priceSlots;
      pitch.images = pitch.images ? JSON.parse(pitch.images) : [];
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

    // Get price slots
    const [priceSlots] = await pool.query(
      'SELECT * FROM price_slots WHERE pitch_id = ? ORDER BY time_slot',
      [id]
    );

    pitch.price_slots = priceSlots;
    pitch.images = pitch.images ? JSON.parse(pitch.images) : [];

    res.json({ 
      success: true,
      pitch 
    });

  } catch (error) {
    console.error('Get pitch error:', error);
    res.status(500).json({ message: 'Lấy thông tin sân thất bại' });
  }
};

export const createPitch = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      name, type, location, description, rules,
      open_time, close_time, min_price, max_price, 
      price_slots, images
    } = req.body;

    await connection.beginTransaction();

    // Insert pitch
    const [result] = await connection.query(
      `INSERT INTO pitches (name, type, location, description, rules, 
       open_time, close_time, min_price, max_price, images, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, type, location, 
        description || null, 
        rules || null, 
        open_time, close_time, 
        min_price, max_price, 
        JSON.stringify(images || []),
        'active'
      ]
    );

    const pitchId = result.insertId;

    // Insert price slots
    if (price_slots && Array.isArray(price_slots)) {
      for (const slot of price_slots) {
        await connection.query(
          'INSERT INTO price_slots (pitch_id, time_slot, price) VALUES (?, ?, ?)',
          [pitchId, slot.time_slot, slot.price]
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
      if (key !== 'price_slots' && updates[key] !== undefined) {
        if (key === 'images' && Array.isArray(updates[key])) {
          fields.push(`${key} = ?`);
          values.push(JSON.stringify(updates[key]));
        } else {
          fields.push(`${key} = ?`);
          values.push(updates[key]);
        }
      }
    });

    if (fields.length > 0) {
      values.push(id);
      await connection.query(
        `UPDATE pitches SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Update price slots if provided
    if (updates.price_slots && Array.isArray(updates.price_slots)) {
      // Delete old price slots
      await connection.query('DELETE FROM price_slots WHERE pitch_id = ?', [id]);
      
      // Insert new price slots
      for (const slot of updates.price_slots) {
        await connection.query(
          'INSERT INTO price_slots (pitch_id, time_slot, price) VALUES (?, ?, ?)',
          [id, slot.time_slot, slot.price]
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
       WHERE pitch_id = ? AND status NOT IN ('cancelled', 'completed')`,
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

    // Get booked slots
    const [bookings] = await pool.query(
      `SELECT start_time, duration, status FROM bookings 
       WHERE pitch_id = ? AND booking_date = ? 
       AND status NOT IN ('cancelled')`,
      [pitch_id, date]
    );

    // Get price slots
    const [priceSlots] = await pool.query(
      'SELECT * FROM price_slots WHERE pitch_id = ? ORDER BY time_slot',
      [pitch_id]
    );

    pitch.images = pitch.images ? JSON.parse(pitch.images) : [];

    res.json({
      success: true,
      pitch,
      price_slots: priceSlots,
      booked_slots: bookings,
      date
    });

  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ message: 'Lấy thông tin thất bại' });
  }
};
