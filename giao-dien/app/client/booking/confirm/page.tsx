'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function BookingConfirmContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [selectedServices, setSelectedServices] = useState({
    bib: false,
    water: false,
    referee: false,
  })

  const fieldId = searchParams.get('fieldId')
  const date = searchParams.get('date')
  const time = searchParams.get('time')

  const field = {
    id: fieldId,
    name: 'Sân bóng Thế Vinh',
    location: 'Quận 1, TP HCM',
    price: 150000,
  }

  const handleConfirmBooking = async () => {
    if (!acceptedTerms) {
      alert('Vui lòng chấp nhận điều khoản dịch vụ')
      return
    }

    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push('/client/booking/payment')
  }

  const calculateTotalFee = () => {
    let totalFee = 10000 // Base service fee
    if (selectedServices.bib) totalFee += 5000
    if (selectedServices.water) totalFee += 20000
    if (selectedServices.referee) totalFee += 200000
    return totalFee
  }

  const calculateTotalPayment = () => {
    return field.price + calculateTotalFee() - (field.price * 0.3)
  }

  if (!fieldId || !date || !time) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 text-center rounded-xl">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thông tin không hợp lệ. Vui lòng quay lại và thử lại.
          </p>
          <Link href="/client/fields">
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
              Quay lại danh sách sân
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Xác nhận đặt sân</h1>
        <p className="text-gray-600 dark:text-gray-400">Kiểm tra thông tin đặt sân trước khi thanh toán</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Details */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Thông tin đặt sân</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-600 dark:text-gray-400">Sân bóng</span>
                <span className="font-medium text-gray-900 dark:text-white">{field.name}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-600 dark:text-gray-400">Địa điểm</span>
                <span className="font-medium text-gray-900 dark:text-white">{field.location}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-600 dark:text-gray-400">Ngày</span>
                <span className="font-medium text-gray-900 dark:text-white">{date}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-600 dark:text-gray-400">Giờ</span>
                <span className="font-medium text-gray-900 dark:text-white">{time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Thời lượng</span>
                <span className="font-medium text-gray-900 dark:text-white">1 giờ</span>
              </div>
            </div>
          </div>

          {/* Selected Services */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Dịch vụ bổ sung</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={selectedServices.bib}
                  onChange={(e) => setSelectedServices({ ...selectedServices, bib: e.target.checked })}
                  className="w-4 h-4 accent-green-500"
                />
                <span className="text-sm text-gray-900 dark:text-white">Áo bib - 5.000 VND</span>
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={selectedServices.water}
                  onChange={(e) => setSelectedServices({ ...selectedServices, water: e.target.checked })}
                  className="w-4 h-4 accent-green-500"
                />
                <span className="text-sm text-gray-900 dark:text-white">Nước thể thao - 20.000 VND</span>
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={selectedServices.referee}
                  onChange={(e) => setSelectedServices({ ...selectedServices, referee: e.target.checked })}
                  className="w-4 h-4 accent-green-500"
                />
                <span className="text-sm text-gray-900 dark:text-white">Thuê trọng tài - 200.000 VND</span>
              </label>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Thông tin khách hàng</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên
                </label>
                <input
                  type="text"
                  defaultValue="Nguyễn Văn A"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="user@example.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  defaultValue="0901234567"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  placeholder="Ví dụ: sẽ có 8 người..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-5 h-5 mt-1 accent-green-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tôi đó là chủ đặt sân và xác nhận rằng tôi đã đọc và đồng ý với{' '}
                <Link href="#" className="text-green-600 dark:text-green-400 hover:underline">
                  điều khoản dịch vụ
                </Link>{' '}
                và{' '}
                <Link href="#" className="text-green-600 dark:text-green-400 hover:underline">
                  chính sách bảo mật
                </Link>
              </span>
            </label>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl sticky top-24">
            <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Tổng hợp đơn đặt</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Giá sân</span>
                <span className="font-medium text-gray-900 dark:text-white">{field.price.toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phí dịch vụ</span>
                <span className="font-medium text-gray-900 dark:text-white">10.000 VND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Dịch vụ bổ sung</span>
                <span className="font-medium text-gray-900 dark:text-white">{calculateTotalFee().toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tiền cọc</span>
                <span className="font-medium text-red-600 dark:text-red-400">-{(field.price * 0.3).toLocaleString()} VND</span>
              </div>
              <div className="border-t border-gray-200 dark:border-slate-700 pt-4 flex justify-between">
                <span className="font-bold text-lg text-gray-900 dark:text-white">Cần thanh toán</span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                  {calculateTotalPayment().toLocaleString()} VND
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={!acceptedTerms || isProcessing}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {isProcessing ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
            </button>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                Thông tin thanh toán:
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Thanh toán tiền cọc trước</li>
                <li>• Thanh toán phần còn lại khi đến sân</li>
                <li>• Có thể hủy đơn miễn phí 24h trước</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Link href="/client/fields">
          <button className="px-6 py-2 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition font-medium">
            Quay lại
          </button>
        </Link>
      </div>
    </div>
  )
}

export default function BookingConfirmPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Đang tải...</div>}>
      <BookingConfirmContent />
    </Suspense>
  )
}
