import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { format, addDays } from 'date-fns';
import pitchService from '../../services/pitchService';
import bookingService from '../../services/bookingService';
import { formatCurrency } from '../../utils/formatters';

const BookingForm = ({ pitchId, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pitch, setPitch] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Load pitch với time_slots theo date
  useEffect(() => {
    const loadPitchData = async () => {
      try {
        console.log('Loading pitch data for:', pitchId, 'date:', selectedDate);
        const data = await pitchService.getPitchById(pitchId, selectedDate);
        console.log('Pitch data loaded:', data);
        setPitch(data.pitch);
        setTimeSlots(data.pitch.time_slots || []);
        // Reset selected slot khi đổi ngày
        setSelectedSlotId('');
      } catch (error) {
        console.error('Error loading pitch:', error);
        toast.error('Không thể tải thông tin sân');
      }
    };

    if (pitchId && selectedDate) {
      loadPitchData();
    }
  }, [pitchId, selectedDate]);

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);

    if (!selectedSlotId) {
      toast.error('Vui lòng chọn khung giờ');
      return;
    }

    const selectedSlot = timeSlots.find(s => s.id === parseInt(selectedSlotId));
    if (!selectedSlot) {
      toast.error('Khung giờ không hợp lệ');
      return;
    }

    if (selectedSlot.is_booked) {
      toast.error('Khung giờ này đã được đặt');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        pitch_id: pitchId,
        booking_date: selectedDate,
        time_slot_id: selectedSlot.id,
        duration: 1, // Có thể tính từ start_time và end_time nếu cần
        notes: data.notes || ''
      };

      console.log('Sending booking request:', bookingData);
      const response = await bookingService.createBooking(bookingData);
      console.log('Booking created successfully:', response);

      toast.success('Đặt sân thành công!');
      navigate('/booking-success');
      
      // Reset form
      setSelectedSlotId('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Đặt sân thất bại';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Generate next 7 days
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(), i);
      const dayName = date.toLocaleDateString('vi-VN', { weekday: 'long' });
      days.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'dd/MM/yyyy'),
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1)
      });
    }
    return days;
  };

  // Get selected slot info
  const selectedSlot = timeSlots.find(s => s.id === parseInt(selectedSlotId));

  if (!pitch) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-2xl font-bold mb-6">Đặt sân</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn ngày
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input"
          >
            {getNextDays().map(day => (
              <option key={day.value} value={day.value}>
                {day.label} - {day.dayName}
              </option>
            ))}
          </select>
        </div>

        {/* Time Slot Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn khung giờ *
          </label>
          
          {timeSlots.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-700 text-sm">
                Không có khung giờ khả dụng cho ngày này
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlotId(slot.id.toString())}
                  disabled={slot.is_booked}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    selectedSlotId === slot.id.toString()
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : slot.is_booked
                      ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary-600'
                  }`}
                >
                  <div className="font-bold">
                    {slot.slot_name || `${slot.start_time} - ${slot.end_time}`}
                  </div>
                  <div className="text-xs mt-1">
                    {formatCurrency(slot.price)}
                  </div>
                  {slot.is_booked && (
                    <div className="text-xs text-red-500 mt-1">Đã đặt</div>
                  )}
                </button>
              ))}
            </div>
          )}
          
          {!selectedSlotId && timeSlots.length > 0 && (
            <p className="text-red-500 text-sm mt-2">Vui lòng chọn khung giờ</p>
          )}
        </div>

        {/* Selected Slot Info */}
        {selectedSlot && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Khung giờ đã chọn:</span>{' '}
              {selectedSlot.slot_name || `${selectedSlot.start_time} - ${selectedSlot.end_time}`}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-medium">Ngày:</span>{' '}
              {format(new Date(selectedDate), 'dd/MM/yyyy')}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-medium">Giá:</span>{' '}
              {formatCurrency(selectedSlot.price)}
            </p>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú
          </label>
          <textarea
            {...register('notes')}
            rows="3"
            className="input"
            placeholder="Thêm ghi chú cho booking..."
          />
        </div>

        {/* Total Price */}
        {selectedSlot && (
          <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">Tổng giá:</span>
              <span className="text-3xl font-bold text-primary-600">
                {formatCurrency(selectedSlot.price)}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedSlotId || timeSlots.length === 0}
          className="btn btn-primary w-full"
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận đặt sân'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
