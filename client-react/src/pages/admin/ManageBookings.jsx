import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import bookingService from '../../services/bookingService';
import { formatCurrency, formatDate, formatTime, getStatusBadgeClass } from '../../utils/formatters';
import { BOOKING_STATUS } from '../../utils/constants';
import Loading from '../../components/common/Loading';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (filter) params.status = filter;
      
      const data = await bookingService.getAllBookings(params);
      setBookings(data.bookings || []);
      setPagination(data.pagination || {});
    } catch (error) {
      toast.error('Không thể tải danh sách booking');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBooking(bookingId, { status: newStatus });
      toast.success('Cập nhật trạng thái thành công');
      loadBookings();
    } catch (error) {
      toast.error(error.message || 'Cập nhật thất bại');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản lý Booking</h1>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('')}
            className={`btn ${filter === '' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Tất cả
          </button>
          {Object.keys(BOOKING_STATUS).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`btn ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
            >
              {BOOKING_STATUS[status].label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sân</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Khách hàng</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SĐT</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ngày</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Giờ</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Giá</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">#{booking.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">{booking.pitch_name}</td>
                  <td className="px-4 py-3 text-sm">{booking.customer_name}</td>
                  <td className="px-4 py-3 text-sm">{booking.customer_phone}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(booking.booking_date)}</td>
                  <td className="px-4 py-3 text-sm">
                    {formatTime(booking.start_time)} ({booking.duration}h)
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold">
                    {formatCurrency(booking.total_price)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`badge ${getStatusBadgeClass(booking.status, 'booking')}`}>
                      {BOOKING_STATUS[booking.status]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <select
                      value={booking.status}
                      onChange={(e) => handleUpdateStatus(booking.id, e.target.value)}
                      className="input py-1 text-sm"
                      disabled={booking.status === 'completed' || booking.status === 'cancelled'}
                    >
                      {Object.keys(BOOKING_STATUS).map(status => (
                        <option key={status} value={status}>
                          {BOOKING_STATUS[status].label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-4 flex justify-center space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => loadBookings(page)}
                className={`px-3 py-1 rounded ${
                  page === pagination.page
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
