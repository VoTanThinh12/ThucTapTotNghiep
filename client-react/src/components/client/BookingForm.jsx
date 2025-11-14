import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { format, addDays, vi } from 'date-fns';
import pitchService from '../../services/pitchService';
import bookingService from '../../services/bookingService';
import { formatCurrency, calculateEndTime } from '../../utils/formatters';
import { TIME_SLOTS, DURATIONS } from '../../utils/constants';

const BookingForm = ({ pitchId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [availableData, setAvailableData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const watchStartTime = watch('start_time');
  const watchDuration = watch('duration', 1);

  // Load available slots
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

  // Calculate price
  useEffect(() => {
    if (watchStartTime && watchDuration && availableData?.price_slots) {
      const timeSlot = watchStartTime.substring(0, 5);
      const priceSlot = availableData.price_slots.find(
        slot => slot.time_slot === timeSlot
      );
      
      if (priceSlot) {
        setCalculatedPrice(priceSlot.price * watchDuration);
      } else {
        const avgPrice = (availableData.pitch.min_price + availableData.pitch.max_price) / 2;
        setCalculatedPrice(avgPrice * watchDuration);
      }
    }
  }, [watchStartTime, watchDuration, availableData]);

  // Check if time slot is booked
  const isSlotBooked = (timeSlot) => {
    if (!availableData?.booked_slots) return false;
    return availableData.booked_slots.some(
      booking => booking.start_time === timeSlot
    );
  };

  const onSubmit = async (data) => {
    console.log('Submitting booking with data:', data);
    
    // Validate required fields
    if (!data.start_time) {
      toast.error('Vui lòng chọn giờ bắt đầu');
      return;
    }
    if (!data.duration) {
      toast.error('Vui lòng chọn thờ i lượng');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        pitch_id: pitchId,
        booking_date: selectedDate,
        start_time: data.start_time,
        duration: parseFloat(data.duration),
        notes: data.notes || ''
      };
      
      console.log('Sending booking request:', bookingData);
      const response = await bookingService.createBooking(bookingData);
      console.log('Booking created successfully:', response);
      
      toast.success('Đặt sân thành công!');
      
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

  // Generate next 7 days - FIX LOCALE ERROR
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

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giờ bắt đầu *
          </label>
          <select
            {...register('start_time', { required: 'Vui lòng chọn giờ bắt đầu' })}
            className="input"
          >
            <option value="">-- Chọn giờ --</option>
            {TIME_SLOTS.map(slot => (
              <option 
                key={slot} 
                value={slot}
                disabled={isSlotBooked(slot)}
              >
                {slot} {isSlotBooked(slot) ? '(Đã đặt)' : ''}
              </option>
            ))}
          </select>
          {errors.start_time && (
            <p className="text-red-500 text-sm mt-1">{errors.start_time.message}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thờ i lượng *
          </label>
          <select
            {...register('duration', { required: 'Vui lòng chọn thờ i lượng' })}
            className="input"
          >
            {DURATIONS.map(duration => (
              <option key={duration.value} value={duration.value}>
                {duration.label}
              </option>
            ))}
          </select>
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
          )}
        </div>

        {/* Time Summary */}
        {watchStartTime && watchDuration && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Thờ i gian:</span> {watchStartTime} - {calculateEndTime(watchStartTime, watchDuration)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Thờ i lượng:</span> {watchDuration} giờ
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
        <div className="bg-primary-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-700">Tổng tiền:</span>
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(calculatedPrice)}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận đặt sân'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
