import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

export const register = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { username, password, full_name, phone, email } = req.body;

    // Check existing username
    const [existingUsers] = await connection.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username đã tồn tại' });
    }

    // Check existing email
    if (email) {
      const [existingEmail] = await connection.query(
        'SELECT id FROM customers WHERE email = ?',
        [email]
      );
      if (existingEmail.length > 0) {
        return res.status(400).json({ message: 'Email đã được sử dụng' });
      }
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    // Create user
    const [userResult] = await connection.query(
      'INSERT INTO users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
      [username, password_hash, full_name || username, 'customer']
    );

    const userId = userResult.insertId;

    // Create customer profile
    await connection.query(
      'INSERT INTO customers (user_id, name, phone, email, status) VALUES (?, ?, ?, ?, ?)',
      [userId, full_name || username, phone || '', email || null, 'active']
    );

    await connection.commit();

    // Generate token
    const token = jwt.sign(
      { userId, username, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id: userId,
        username,
        full_name: full_name || username,
        role: 'customer'
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Đăng ký thất bại', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        message: 'Username hoặc password không đúng' 
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Username hoặc password không đúng' 
      });
    }


    // Generate token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Đăng nhập thất bại' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.username, u.full_name, u.role, u.created_at, u.last_login,
              c.id as customer_id, c.phone, c.email, c.total_spent, c.booking_count, c.status
       FROM users u
       LEFT JOIN customers c ON u.id = c.user_id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Lấy thông tin thất bại' });
  }
};

export const updateProfile = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { full_name, phone, email } = req.body;
    const userId = req.user.id;

    await connection.beginTransaction();

    // Update user table
    if (full_name) {
      await connection.query(
        'UPDATE users SET full_name = ? WHERE id = ?',
        [full_name, userId]
      );
    }

    // Update customer table
    const updates = [];
    const values = [];

    if (full_name) {
      updates.push('name = ?');
      values.push(full_name);
    }
    if (phone) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }

    if (updates.length > 0) {
      values.push(userId);
      await connection.query(
        `UPDATE customers SET ${updates.join(', ')} WHERE user_id = ?`,
        values
      );
    }

    await connection.commit();

    res.json({ message: 'Cập nhật thông tin thành công' });

  } catch (error) {
    await connection.rollback();
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Cập nhật thông tin thất bại' });
  } finally {
    connection.release();
  }
};

export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const userId = req.user.id;

    // Get current password hash
    const [users] = await pool.query(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    // Verify current password
    const isValid = await bcrypt.compare(current_password, users[0].password_hash);
    
    if (!isValid) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    // Hash new password
    const new_password_hash = await bcrypt.hash(new_password, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [new_password_hash, userId]
    );

    res.json({ message: 'Đổi mật khẩu thành công' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Đổi mật khẩu thất bại' });
  }
};

