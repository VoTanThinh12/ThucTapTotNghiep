const { pool } = require('../lib/db');

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd; // half-open intervals
}

async function listBookings(req, res) {
  try {
    const status = req.query.status;
    let sql = 'SELECT b.*, p.name as pitch_name FROM bookings b JOIN pitches p ON p.id=b.pitch_id';
    const params = [];
    if (status) { sql += ' WHERE b.status=?'; params.push(status); }
    sql += ' ORDER BY b.created_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function createBooking(req, res) {
  try {
    const { user_name, phone, pitch_id, date, start_time, end_time, note } = req.body;
    // Load pitch price
    const [[pitch]] = await pool.query('SELECT id, price_hour FROM pitches WHERE id=? AND active=1', [pitch_id]);
    if (!pitch) return res.status(400).json({ message: 'Sân không tồn tại/không hoạt động' });

    // Check overlap
    const [exist] = await pool.query('SELECT start_time, end_time FROM bookings WHERE pitch_id=? AND date=? AND status<>"cancelled"', [pitch_id, date]);
    const s = start_time; const e = end_time;
    const hasOverlap = exist.some(r => overlaps(s, e, r.start_time, r.end_time));
    if (hasOverlap) return res.status(409).json({ message: 'Khung giờ đã có người đặt' });

    // Calculate price by hours
    const [hours] = await pool.query('SELECT TIMESTAMPDIFF(MINUTE, ?, ?) AS minutes', [date + ' ' + start_time, date + ' ' + end_time]);
    const minutes = hours[0].minutes;
    if (minutes <= 0) return res.status(400).json({ message: 'Thời gian không hợp lệ' });
    const price = Math.ceil((minutes / 60) * (pitch.price_hour || 0));

    const [result] = await pool.query(
      'INSERT INTO bookings (user_name, phone, pitch_id, date, start_time, end_time, price, status, note) VALUES (?,?,?,?,?,?,?,?,?)',
      [user_name, phone, pitch_id, date, start_time, end_time, price, 'pending', note || null]
    );
    res.status(201).json({ id: result.insertId, price, status: 'pending' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function updateStatus(req, res) {
  try {
    const id = req.params.id;
    const { status } = req.body; // pending|confirmed|cancelled
    if (!['pending','confirmed','cancelled'].includes(status)) return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    await pool.query('UPDATE bookings SET status=? WHERE id=?', [status, id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = { listBookings, createBooking, updateStatus };
