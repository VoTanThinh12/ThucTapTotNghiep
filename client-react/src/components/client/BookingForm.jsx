import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { format, addDays } from 'date-fns';
import pitchService from '../../services/pitchService';
import bookingService from '../../services/bookingService';
import { formatCurrency } from '../../utils/formatters';

const BookingForm = ({ pitchId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [availableData, setAvailableData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0);
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Load available price slots
  useEffect(() => {
    const loadAvailableSlots = async () => {
      try {
        console.log('Loading available slots for pitchId:', pitchId, 'date:', selectedDate);
        const data = await pitchService.getAvailableSlots(pitchId, selectedDate);
        console.log('Available slots loaded:', data);
        setAvailableData(data);
      } catch (error) {
        console.error('Error loading available slots:', error);
        toast.error('Không thể tải thông tin khả dụng');
      }
    };
    
    if (pitchId && selectedDate) {
      loadAvailableSlots();
    }
  }, [pitchId, selectedDate]);

  // Update price when slot changes
  useEffect(() => {
    if (selectedSlot && availableData?.price_slots) {
      const slot = availableData.price_slots.find(s => s.time_slot === selectedSlot);
      if (slot) {
        setSelectedPrice(slot.price);
        console.log('Price updated for slot:', selectedSlot, 'Price:', slot.price);
      }
    }
  }, [selectedSlot, availableData]);

  // Check if time slot is booked
  const isSlotBooked = (timeSlot) => {
    if (!availableData?.booked_slots) return false;
    return availableData.booked_slots.some(
      booking => booking.time_slot === timeSlot
    );
  };

  const onSubmit = async (data) => {
    console.log('Submitting booking with data:', data);
    
    // Validate required fields
    if (!selectedSlot) {
      toast.error('Vui lòng chọn khung giờ');
      return;
    }

    setLoading(true);
    try {
      // Parse time slot (e.g., '06-09' => start_time '06:00', duration 3)
      const [startHour, endHour] = selectedSlot.split('-').map(Number);
      const duration = endHour - startHour;
      const start_time = `${String(startHour).padStart(2, '0')}:00`;

      const bookingData = {
        pitch_id: pitchId,
        booking_date: selectedDate,
        time_slot: selectedSlot,
        start_time: start_time,
        duration: duration,
        total_price: selectedPrice,
        notes: data.notes || ''
      };
      
      console.log('Sending booking request:', bookingData);
      const response = await bookingService.createBooking(bookingData);
      console.log('Booking created successfully:', response);
      
      toast.success('Đặt sân thành công!');
      setSelectedSlot('');
      setSelectedPrice(0);
      
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

  if (!availableData) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading...</p>
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

        {/* Time Slot Selection - From Price Table */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn khung giờ *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableData?.price_slots?.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlot(slot.time_slot)}
                disabled={isSlotBooked(slot.time_slot)}
                className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  selectedSlot === slot.time_slot
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : isSlotBooked(slot.time_slot)
                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary-600'
                }`}
              >
                <div className="font-bold">{slot.time_slot.replace('-', ':00-')}:00</div>
                <div className="text-xs mt-1">{formatCurrency(slot.price)}</div>
                {isSlotBooked(slot.time_slot) && (
                  <div className="text-xs text-gray-500 mt-1">Đã đặt</div>
                )}
              </button>
            ))}
          </div>
          {!selectedSlot && (
            <p className="text-red-500 text-sm mt-2">Vui lòng chọn khung giờ</p>
          )}
        </div>

        {/* Selected Slot Info */}
        {selectedSlot && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Khung giờ đã chọn:</span> {selectedSlot.replace('-', ':00-')}:00
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-medium">Ngày:</span> {format(new Date(selectedDate), 'dd/MM/yyyy')}
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

        {/* Price */}
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-700">Tổng giá:</span>
            <span className="text-3xl font-bold text-primary-600">
              {formatCurrency(selectedPrice)}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !selectedSlot}
          className="btn btn-primary w-full"
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận đặt sân'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
