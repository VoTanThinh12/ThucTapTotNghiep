const { pool } = require('../lib/db');

async function listPitches(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM pitches ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function createPitch(req, res) {
  try {
    const { name, type, location, description, price_hour, active } = req.body;
    const [result] = await pool.query(
      'INSERT INTO pitches (name, type, location, description, price_hour, active) VALUES (?,?,?,?,?,?)',
      [name, type, location, description || null, price_hour || 0, active ?? 1]
    );
    res.status(201).json({ id: result.insertId });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function updatePitch(req, res) {
  try {
    const id = req.params.id;
    const { name, type, location, description, price_hour, active } = req.body;
    await pool.query(
      'UPDATE pitches SET name=?, type=?, location=?, description=?, price_hour=?, active=? WHERE id=?',
      [name, type, location, description || null, price_hour || 0, active ?? 1, id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function deletePitch(req, res) {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM pitches WHERE id=?', [id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function getBookingsByDate(req, res) {
  try {
    const id = req.params.id;
    const date = req.query.date; // YYYY-MM-DD
    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE pitch_id=? AND date=? ORDER BY start_time',
      [id, date]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = { listPitches, createPitch, updatePitch, deletePitch, getBookingsByDate };
