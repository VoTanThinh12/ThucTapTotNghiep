import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const BookingSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <FaCheckCircle className="w-24 h-24 text-green-500 mx-auto animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Đặt Sân Thành Công!
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-2">
          Cảm ơn bạn đã đặt sân của chúng tôi.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Chi tiết đặt hàng sẽ được gửi đến email của bạn trong giây phút.
        </p>

        {/* Order Details */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Đặt hàng thố:</span>
            <span className="text-green-600 font-medium ml-2">Chờ Xác Nhận</span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Đặt hàng sẽ được xác nhận trong 24 giờ
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/bookings')}
            className="btn btn-primary w-full"
          >
            Xem Chi Tiết Đặt Hàng
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-outline w-full"
          >
            Về Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
