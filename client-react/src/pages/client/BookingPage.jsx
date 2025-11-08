import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pitchService } from '../../services/pitchService';
import { bookingService } from '../../services/bookingService';
import { toast } from 'react-toastify';

const Booking = () => {
  const { pitchId } = useParams();
  const navigate = useNavigate();
  const [pitch, setPitch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    date: '',
    startTime: '',
    duration: 1,
    note: '',
  });

  const [availability, setAvailability] = useState(null);

  useEffect(() => {
    fetchPitch();
  }, [pitchId]);

  useEffect(() => {
    if (formData.date && formData.startTime && formData.duration) {
      checkAvailabilityAndPrice();
    }
  }, [formData.date, formData.startTime, formData.duration]);

  const fetchPitch = async () => {
    try {
      const data = await pitchService.getPitchById(pitchId);
      setPitch(data.data);
    } catch (error) {
      toast.error('Không tìm thấy sân');
      navigate('/pitches');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailabilityAndPrice = async () => {
    setChecking(true);
    try {
      // Check availability
      const availData = await bookingService.checkAvailability(
        pitchId, formData.date, formData.startTime, formData.duration
      );
      setAvailability(availData.available);

      // Calculate price
      if (availData.available) {
        const priceData = await bookingService.calculatePrice(
          pitchId, formData.startTime, formData.duration
        );
        setCalculatedPrice(priceData.price);
      } else {
        setCalculatedPrice(0);
        toast.warning('Khung giờ này đã được đặt');
      }
    } catch (error) {
      console.error('Error checking:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!availability) {
      toast.error('Khung giờ không khả dụng');
      return;
    }

    try {
      await bookingService.createBooking({
        pitchId,
        ...formData,
      });
      
      toast.success('Đặt sân thành công! Vui lòng chờ xác nhận.');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đặt sân thất bại');
    }
  };

  const durationOptions = [0.5, 1, 1.5, 2, 2.5, 3];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Đặt sân: {pitch.name}</h1>

          {/* Pitch Info */}
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700">📍 {pitch.location}</p>
            <p className="text-gray-700">🏟️ Loại sân: {pitch.type}</p>
            <p className="text-gray-700">⏰ {pitch.open_time} - {pitch.close_time}</p>
            <p className="text-green-600 font-bold text-lg">
              💰 {pitch.min_price.toLocaleString('vi-VN')} - {pitch.max_price.toLocaleString('vi-VN')} VNĐ/giờ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Họ tên *</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Số điện thoại *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Booking Details */}
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Ngày đặt *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Giờ bắt đầu *</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Thời lượng (giờ) *</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  {durationOptions.map(dur => (
                    <option key={dur} value={dur}>
                      {dur} giờ
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Availability Status */}
            {formData.date && formData.startTime && formData.duration && (
              <div className={`p-4 rounded-lg ${availability ? 'bg-green-50' : 'bg-red-50'}`}>
                {checking ? (
                  <p>⏳ Đang kiểm tra...</p>
                ) : availability ? (
                  <p className="text-green-700 font-semibold">✅ Khung giờ này còn trống</p>
                ) : (
                  <p className="text-red-700 font-semibold">❌ Khung giờ này đã được đặt</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Ghi chú</label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="Ghi chú thêm nếu có..."
              />
            </div>

            {/* Price Display */}
            {calculatedPrice > 0 && (
              <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
                <p className="text-2xl font-bold text-gray-800 text-center">
                  Tổng tiền: {calculatedPrice.toLocaleString('vi-VN')} VNĐ
                </p>
                <p className="text-sm text-gray-600 text-center mt-2">
                  (Cần đặt cọc 30% = {(calculatedPrice * 0.3).toLocaleString('vi-VN')} VNĐ)
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!availability || checking}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {checking ? 'Đang kiểm tra...' : 'Xác nhận đặt sân'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
