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
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    date: '',
    timeSlotId: '',
    duration: 1,
    note: '',
  });
  const [availability, setAvailability] = useState(null);

  useEffect(() => {
    fetchPitch();
  }, [pitchId]);

  useEffect(() => {
    if (formData.date) {
      fetchTimeSlots();
    }
  }, [formData.date]);

  useEffect(() => {
    if (formData.date && formData.timeSlotId && formData.duration) {
      checkAvailabilityAndPrice();
    }
  }, [formData.date, formData.timeSlotId, formData.duration]);

  const fetchPitch = async () => {
    try {
      const data = await pitchService.getPitchById(pitchId);
      setPitch(data.data);
    } catch (error) {
      toast.error('Khong tim thay san');
      navigate('/pitches');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await pitchService.getPitchTimeSlots(pitchId);
      if (response.success && response.data) {
        setTimeSlots(response.data);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Khong the tai khung gio');
      setTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const checkAvailabilityAndPrice = async () => {
    setChecking(true);
    try {
      const selectedSlot = timeSlots.find(slot => slot.id === parseInt(formData.timeSlotId));
      if (!selectedSlot) {
        setAvailability(false);
        return;
      }

      const availData = await bookingService.checkAvailability(
        pitchId,
        formData.date,
        selectedSlot.start_time,
        formData.duration
      );
      setAvailability(availData.available);

      if (availData.available) {
        const totalPrice = selectedSlot.price * formData.duration;
        setCalculatedPrice(totalPrice);
      } else {
        setCalculatedPrice(0);
        toast.warning('Khung gio nay da duoc dat');
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
      toast.error('Khung gio khong kha dung');
      return;
    }

    try {
      const selectedSlot = timeSlots.find(slot => slot.id === parseInt(formData.timeSlotId));
      await bookingService.createBooking({
        pitchId,
        ...formData,
        startTime: selectedSlot.start_time,
        timeSlotId: parseInt(formData.timeSlotId),
      });

      toast.success('Dat san thanh cong! Vui long cho xac nhan.');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Dat san that bai');
    }
  };

  const durationOptions = [0.5, 1, 1.5, 2, 2.5, 3];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Dang tai...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Dat san: {pitch.name}</h1>
          {/* Pitch Info */}
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700">📍 {pitch.location}</p>
            <p className="text-gray-700">🏟️ Loai san: {pitch.type}</p>
            <p className="text-gray-700">⏰ {pitch.open_time} - {pitch.close_time}</p>
            <p className="text-green-600 font-bold text-lg">
              💰 {pitch.min_price.toLocaleString('vi-VN')} - {pitch.max_price.toLocaleString('vi-VN')} VND/gio
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Ho ten *</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">So dien thoai *</label>
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
              <label className="block text-gray-700 mb-2 font-semibold">Ngay dat *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value, timeSlotId: '' })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            {/* Time Slots Dropdown */}
            {formData.date && (
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Chon khung gio *</label>
                {loadingSlots ? (
                  <p className="text-gray-500">Dang tai khung gio...</p>
                ) : timeSlots.length > 0 ? (
                  <select
                    value={formData.timeSlotId}
                    onChange={(e) => setFormData({ ...formData, timeSlotId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">-- Chon khung gio --</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.id} value={slot.id} disabled={!slot.is_available}>
                        {slot.start_time} - {slot.end_time} ({slot.price.toLocaleString('vi-VN')} VND)
                        {!slot.is_available ? ' - Da dat' : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-red-500">Khong co khung gio nao</p>
                )}
              </div>
            )}
            <div className="grid md:grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Thoi luong (gio) *</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  {durationOptions.map((dur) => (
                    <option key={dur} value={dur}>
                      {dur} gio
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Availability Status */}
            {formData.date && formData.timeSlotId && formData.duration && (
              <div className={`p-4 rounded-lg ${availability ? 'bg-green-50' : 'bg-red-50'}`}>
                {checking ? (
                  <p>Dang kiem tra...</p>
                ) : availability ? (
                  <p className="text-green-700 font-semibold">✅ Khung gio nay con trong</p>
                ) : (
                  <p className="text-red-700 font-semibold">❌ Khung gio nay da duoc dat</p>
                )}
              </div>
            )}
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Ghi chu</label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="Ghi chu them neu co..."
              />
            </div>
            {/* Price Display */}
            {calculatedPrice > 0 && (
              <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
                <p className="text-2xl font-bold text-gray-800 text-center">
                  Tong tien: {calculatedPrice.toLocaleString('vi-VN')} VND
                </p>
                <p className="text-sm text-gray-600 text-center mt-2">
                  (Can dat coc 30% = {(calculatedPrice * 0.3).toLocaleString('vi-VN')} VND)
                </p>
              </div>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              disabled={!availability || checking}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {checking ? 'Dang kiem tra...' : 'Xac nhan dat san'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
