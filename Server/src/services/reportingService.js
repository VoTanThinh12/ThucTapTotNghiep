const db = require('../config/database');

class ReportingService {
  // Doanh thu theo khoảng ngày
  async getRevenueByDate(fromDate, toDate, pitchId = null) {
    let query = `
      SELECT 
        DATE(booking_date) as date,
        SUM(total_price) as revenue,
        COUNT(*) as booking_count
      FROM bookings
      WHERE booking_date BETWEEN ? AND ?
      AND status IN ('confirmed', 'completed')
    `;
    
    const params = [fromDate, toDate];
    
    if (pitchId) {
      query += ' AND pitch_id = ?';
      params.push(pitchId);
    }
    
    query += ' GROUP BY DATE(booking_date) ORDER BY date';
    
    const [results] = await db.query(query, params);
    return results;
  }

  // Thống kê sử dụng sân
  async getPitchUsageStats() {
    const [results] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.type,
        COUNT(b.id) as total_bookings,
        SUM(b.duration) as total_hours,
        SUM(b.total_price) as total_revenue,
        AVG(b.total_price) as avg_booking_price
      FROM pitches p
      LEFT JOIN bookings b ON p.id = b.pitch_id AND b.status IN ('confirmed', 'completed')
      GROUP BY p.id
      ORDER BY total_revenue DESC
    `);
    
    return results;
  }

  // Top khách hàng
  async getTopCustomers(limit = 10) {
    const [results] = await db.query(`
      SELECT 
        c.id,
        c.name,
        c.phone,
        c.email,
        c.total_spent,
        c.booking_count,
        COUNT(b.id) as recent_bookings
      FROM customers c
      LEFT JOIN bookings b ON c.id = b.customer_id AND b.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY c.id
      ORDER BY c.total_spent DESC
      LIMIT ?
    `, [limit]);
    
    return results;
  }

  // Dashboard statistics
  async getDashboardStats() {
    // Tổng doanh thu hôm nay
    const [todayRevenue] = await db.query(`
      SELECT COALESCE(SUM(total_price), 0) as revenue
      FROM bookings
      WHERE DATE(booking_date) = CURDATE()
      AND status IN ('confirmed', 'completed')
    `);

    // Số đơn hôm nay
    const [todayBookings] = await db.query(`
      SELECT COUNT(*) as count
      FROM bookings
      WHERE DATE(created_at) = CURDATE()
    `);

    // Khách hàng mới tháng này
    const [newCustomers] = await db.query(`
      SELECT COUNT(*) as count
      FROM customers
      WHERE MONTH(created_at) = MONTH(CURDATE())
      AND YEAR(created_at) = YEAR(CURDATE())
    `);

    // Tỷ lệ sử dụng
    const [usageRate] = await db.query(`
      SELECT 
        COUNT(DISTINCT pitch_id) * 100.0 / (SELECT COUNT(*) FROM pitches WHERE status = 'active') as rate
      FROM bookings
      WHERE booking_date = CURDATE()
      AND status IN ('confirmed', 'completed')
    `);

    return {
      todayRevenue: todayRevenue[0].revenue,
      todayBookings: todayBookings[0].count,
      newCustomers: newCustomers[0].count,
      usageRate: usageRate[0].rate || 0
    };
  }

  // Export to CSV format
  exportToCSV(data, filename) {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    
    return [headers, ...rows].join('\n');
  }
}

module.exports = new ReportingService();
