import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaFutbol, FaCalendarCheck, FaUsers, FaDollarSign } from 'react-icons/fa';
import bookingService from '../../services/bookingService';
import customerService from '../../services/customerService';
import pitchService from '../../services/pitchService';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { BOOKING_STATUS } from '../../utils/constants';
import Loading from '../../components/common/Loading';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPitches: 0,
    totalBookings: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentBookings: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [pitchesData, bookingsData, customersData, bookingStats] = await Promise.all([
        pitchService.getAllPitches(),
        bookingService.getAllBookings({ limit: 5 }),
        customerService.getCustomerStats(),
        bookingService.getBookingStats()
      ]);

      const revenue = bookingStats.stats?.by_status?.reduce((sum, item) => {
        if (item.status === 'completed') {
          return sum + (parseFloat(item.revenue) || 0);
        }
        return sum;
      }, 0) || 0;

      setStats({
        totalPitches: pitchesData.count || 0,
        totalBookings: bookingsData.pagination?.total || 0,
        totalCustomers: customersData.stats?.total || 0,
        totalRevenue: revenue,
        recentBookings: bookingsData.bookings || []
      });

    } catch (error) {
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const statCards = [
    {
      title: 'Tổng số sân',
      value: stats.totalPitches,
      icon: FaFutbol,
      color: 'bg-blue-500'
    },
    {
      title: 'Tổng booking',
      value: stats.totalBookings,
      icon: FaCalendarCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Tổng khách hàng',
      value: stats.totalCustomers,
      icon: FaUsers,
      color: 'bg-purple-500'
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: FaDollarSign,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Booking gần đây</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sân</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Khách hàng</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ngày</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Giờ</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Giá</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">#{booking.id}</td>
                  <td className="px-4 py-3 text-sm">{booking.pitch_name}</td>
                  <td className="px-4 py-3 text-sm">{booking.customer_name}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(booking.booking_date)}</td>
                  <td className="px-4 py-3 text-sm">{formatTime(booking.start_time)}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(booking.total_price)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`badge badge-${BOOKING_STATUS[booking.status]?.color}`}>
                      {BOOKING_STATUS[booking.status]?.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
