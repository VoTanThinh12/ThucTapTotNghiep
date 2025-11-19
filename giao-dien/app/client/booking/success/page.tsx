import Link from 'next/link'

export default function BookingSuccessPage() {
  const bookingId = 'BK20250118001'

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-5xl text-green-600">✓</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Đặt sân thành công</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
        </p>
      </div>

      {/* Booking Details */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 mb-8 rounded-xl">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mã đặt sân</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{bookingId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Trạng thái</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">Đã xác nhận</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 pt-8 space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Thông tin đặt sân</h3>
            <div className="space-y-3">
              <div className="flex justify-between pb-3 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-600 dark:text-gray-400">Sân bóng</span>
                <span className="font-medium text-gray-900 dark:text-white">Sân bóng Thế Vinh</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-600 dark:text-gray-400">Địa điểm</span>
                <span className="font-medium text-gray-900 dark:text-white">Quận 1, TP HCM</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-600 dark:text-gray-400">Ngày</span>
                <span className="font-medium text-gray-900 dark:text-white">18/01/2025</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-600 dark:text-gray-400">Giờ</span>
                <span className="font-medium text-gray-900 dark:text-white">18:00 - 19:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tổng tiền</span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">175.000 VND</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-6 mb-8 rounded-xl">
        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Các bước tiếp theo</h3>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="font-bold text-green-600 dark:text-green-400">1</span>
            <span className="text-gray-900 dark:text-white">
              Xác nhận với chủ sân qua điện thoại hoặc email
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-green-600 dark:text-green-400">2</span>
            <span className="text-gray-900 dark:text-white">
              Đến sân trước 10 phút giờ dự định
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-green-600 dark:text-green-400">3</span>
            <span className="text-gray-900 dark:text-white">
              Thanh toán phần còn lại khi tới sân
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-green-600 dark:text-green-400">4</span>
            <span className="text-gray-900 dark:text-white">
              Đánh giá sân sau khi sử dụng dịch vụ
            </span>
          </li>
        </ol>
      </div>

      {/* Contact Info */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 mb-8 rounded-xl">
        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Liên hệ với sân</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span>📱</span>
            <a href="tel:0901234567" className="text-green-600 dark:text-green-400 hover:underline">
              0901 234 567
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span>📧</span>
            <a href="mailto:info@santhevinh.com" className="text-green-600 dark:text-green-400 hover:underline">
              info@santhevinh.com
            </a>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link href="/client/bookings" className="flex-1">
          <button className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium">
            Xem đơn đặt của bạn
          </button>
        </Link>
        <Link href="/client/fields" className="flex-1">
          <button className="w-full px-6 py-3 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition font-medium">
            Tiếp tục tìm sân
          </button>
        </Link>
      </div>

      {/* Email Confirmation */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Thư xác nhận đặt sân đã được gửi đến email của bạn.
        </p>
      </div>
    </div>
  )
}
