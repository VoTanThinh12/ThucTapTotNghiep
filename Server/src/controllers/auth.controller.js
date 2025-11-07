const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../lib/db');

async function register(req, res) {
  try {
    const { username, password, full_name, role } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Thiếu username/password' });

    const [exists] = await pool.query('SELECT id FROM users WHERE username=?', [username]);
    if (exists.length) return res.status(409).json({ message: 'Username đã tồn tại' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, password_hash, full_name, role) VALUES (?,?,?,?)',
      [username, hash, full_name || null, role === 'admin' ? 'admin' : 'user']
    );

    return res.status(201).json({ id: result.insertId });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query('SELECT id, username, password_hash, role FROM users WHERE username=?', [username]);
    if (!rows.length) return res.status(401).json({ message: 'Sai thông tin đăng nhập' });
    const user = rows[0];

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Sai thông tin đăng nhập' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    return res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

module.exports = { register, login };
