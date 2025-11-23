// ================================================================
// ADMIN DASHBOARD PAGE - Trang quản trị tổng quan
// ================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI, pitchAPI, userAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPitches: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings
      const bookingsRes = await bookingAPI.getAll();
      const bookings = bookingsRes.data.bookings;

      // Fetch pitches
      const pitchesRes = await pitchAPI.getAll({});
      const pitches = pitchesRes.data.pitches;

      // Fetch users
      const usersRes = await userAPI.getAll();
      const users = usersRes.data.users;

      // Tính tổng doanh thu
      const revenue = bookings
        .filter((b) => b.status === 'completed')
        .reduce((sum, b) => sum + parseFloat(b.total_price), 0);

      setStats({
        totalPitches: pitches.length,
        totalBookings: bookings.length,
        totalUsers: users.length,
        totalRevenue: revenue
      });

      // Lấy 5 đơn đặt gần nhất
      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'warning',
      confirmed: 'info',
      completed: 'success',
      cancelled: 'danger'
    };
    return `badge bg-${badges[status] || 'secondary'}`;
  };

  const getStatusText = (status) => {
    const text = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    return text[status] || status;
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Dashboard</h2>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Tổng sân bóng</h6>
                  <h2 className="mb-0">{stats.totalPitches}</h2>
                </div>
                <i className="bi bi-dribbble" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Đơn đặt sân</h6>
                  <h2 className="mb-0">{stats.totalBookings}</h2>
                </div>
                <i className="bi bi-calendar-check" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Khách hàng</h6>
                  <h2 className="mb-0">{stats.totalUsers}</h2>
                </div>
                <i className="bi bi-people" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Doanh thu</h6>
                  <h2 className="mb-0">{stats.totalRevenue.toLocaleString()}đ</h2>
                </div>
                <i className="bi bi-cash-stack" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="mb-0">Đơn đặt gần đây</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Sân</th>
                      <th>Ngày đặt</th>
                      <th>Giờ</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="fw-bold">{booking.booking_code}</td>
                        <td>{booking.customer_name}</td>
                        <td>{booking.pitch_name}</td>
                        <td>{new Date(booking.booking_date).toLocaleDateString('vi-VN')}</td>
                        <td>
                          {booking.start_time} - {booking.end_time}
                        </td>
                        <td className="fw-bold text-success">
                          {parseInt(booking.total_price).toLocaleString()}đ
                        </td>
                        <td>
                          <span className={getStatusBadge(booking.status)}>
                            {getStatusText(booking.status)}
                          </span>
                        </td>
                        <td>
                          <Link
                            to={`/admin/bookings/${booking.id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Chi tiết
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-plus-circle text-primary" style={{ fontSize: '3rem' }}></i>
              <h5 className="mt-3">Thêm sân mới</h5>
              <Link to="/admin/pitches/new" className="btn btn-primary mt-2">
                Tạo sân
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-clipboard-check text-success" style={{ fontSize: '3rem' }}></i>
              <h5 className="mt-3">Xem đơn đặt</h5>
              <Link to="/admin/bookings" className="btn btn-success mt-2">
                Quản lý đơn
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-bar-chart text-info" style={{ fontSize: '3rem' }}></i>
              <h5 className="mt-3">Xem báo cáo</h5>
              <Link to="/admin/reports" className="btn btn-info mt-2">
                Báo cáo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
