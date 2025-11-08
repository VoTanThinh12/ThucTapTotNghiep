import React from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { formatCurrency, formatDate, formatTime, getStatusBadgeClass } from '../../utils/formatters';
import { BOOKING_STATUS } from '../../utils/constants';

const BookingCard = ({ booking, onCancel }) => {
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
  const statusInfo = BOOKING_STATUS[booking.status];

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{booking.pitch_name}</h3>
          <p className="text-sm text-gray-600 flex items-center mt-1">
            <FaMapMarkerAlt className="mr-1" />
            {booking.pitch_location}
          </p>
        </div>
        <span className={`badge ${getStatusBadgeClass(booking.status, 'booking')}`}>
          {statusInfo?.label}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-700">
          <FaCalendarAlt className="mr-2 text-primary-600" />
          <span>Ngày: {formatDate(booking.booking_date)}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <FaClock className="mr-2 text-primary-600" />
          <span>
            Giờ: {formatTime(booking.start_time)} ({booking.duration} giờ)
          </span>
        </div>
      </div>

      {booking.notes && (
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Ghi chú:</span> {booking.notes}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          <span className="text-sm text-gray-600">Tổng tiền:</span>
          <p className="text-2xl font-bold text-primary-600">
            {formatCurrency(booking.total_price)}
          </p>
        </div>
        {canCancel && onCancel && (
          <button
            onClick={() => onCancel(booking.id)}
            className="btn btn-danger"
          >
            Hủy booking
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
