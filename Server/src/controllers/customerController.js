import { pool } from '../config/database.js';

export const getAllCustomers = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    let query = `
      SELECT c.*, u.username, u.full_name, u.created_at as user_created_at
      FROM customers c
      INNER JOIN users u ON c.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (c.name LIKE ? OR c.phone LIKE ? OR c.email LIKE ? OR u.username LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const offset = (page - 1) * limit;
    query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [customers] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM customers c INNER JOIN users u ON c.user_id = u.id WHERE 1=1';
    const countParams = [];
    
    if (status) {
      countQuery += ' AND c.status = ?';
      countParams.push(status);
    }
    if (search) {
      countQuery += ' AND (c.name LIKE ? OR c.phone LIKE ? OR c.email LIKE ? OR u.username LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Lấy danh sách khách hàng thất bại' });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const [customers] = await pool.query(
      `SELECT c.*, u.username, u.full_name, u.created_at as user_created_at, u.last_login
       FROM customers c
       INNER JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [id]
    );

    if (customers.length === 0) {
      return res.status(404).json({ message: 'Khách hàng không tồn tại' });
    }

    const customer = customers[0];

    // Get customer bookings
    const [bookings] = await pool.query(
      `SELECT b.*, p.name as pitch_name, p.type as pitch_type
       FROM bookings b
       INNER JOIN pitches p ON b.pitch_id = p.id
       WHERE b.customer_id = ?
       ORDER BY b.booking_date DESC
       LIMIT 10`,
      [id]
    );

    customer.recent_bookings = bookings;

    res.json({
      success: true,
      customer
    });

  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Lấy thông tin khách hàng thất bại' });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, status } = req.body;

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'Không có dữ liệu để cập nhật' });
    }

    values.push(id);
    await pool.query(
      `UPDATE customers SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Cập nhật khách hàng thành công'
    });

  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Cập nhật khách hàng thất bại' });
  }
};

export const getCustomerStats = async (req, res) => {
  try {
    // Total customers
    const [totalResult] = await pool.query(
      'SELECT COUNT(*) as total FROM customers'
    );

    // Active customers (has bookings in last 30 days)
    const [activeResult] = await pool.query(
      `SELECT COUNT(DISTINCT customer_id) as active
       FROM bookings
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    // Top customers by spending
    const [topCustomers] = await pool.query(
      `SELECT c.id, c.name, c.phone, c.total_spent, c.booking_count,
              u.username
       FROM customers c
       INNER JOIN users u ON c.user_id = u.id
       ORDER BY c.total_spent DESC
       LIMIT 10`
    );

    res.json({
      success: true,
      stats: {
        total: totalResult[0].total,
        active: activeResult[0].active,
        top_customers: topCustomers
      }
    });

  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({ message: 'Lấy thống kê khách hàng thất bại' });
  }
};
