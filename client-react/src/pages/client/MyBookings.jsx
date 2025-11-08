import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import bookingService from '../../services/bookingService';
import BookingCard from '../../components/client/BookingCard';
import Loading from '../../components/common/Loading';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const params = filter ? { status: filter } : {};
      const data = await bookingService.getMyBookings(params);
      setBookings(data.bookings || []);
    } catch (error) {
      toast.error('Không thể tải danh sách booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Bạn có chắc muốn hủy booking này?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Hủy booking thành công');
      loadBookings();
    } catch (error) {
      toast.error(error.message || 'Hủy booking thất bại');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Lịch đặt sân của tôi
        </h1>

        {/* Filter */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('')}
              className={`btn ${filter === '' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Chờ xác nhận
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`btn ${filter === 'confirmed' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Đã xác nhận
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Hoàn thành
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Đã hủy
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không có booking nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
