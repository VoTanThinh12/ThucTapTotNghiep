'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PaymentPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)

  const bookingAmount = 175000

  const handlePayment = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    router.push('/client/booking/success')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Thanh toán</h1>
        <p className="text-gray-600 dark:text-gray-400">Chọn phương thức thanh toán để hoàn tất đơn đặt sân</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-2 space-y-4">
          {/* Credit/Debit Card */}
          <div className={`border-2 p-6 cursor-pointer transition-all rounded-xl ${
            paymentMethod === 'card'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
              : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-green-500/50'
          }`}
            onClick={() => setPaymentMethod('card')}
          >
            <div className="flex items-start gap-4">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                readOnly
                className="w-5 h-5 mt-1 accent-green-500"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Thẻ tín dụng / Thẻ ghi nợ</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Thanh toán an toàn bằng thẻ tín dụng hoặc ghi nợ
                </p>
              </div>
              <span className="text-2xl">💳</span>
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-6 space-y-4 pl-12">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số thẻ
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ngày hết hạn
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* E-Wallet */}
          <div className={`border-2 p-6 cursor-pointer transition-all rounded-xl ${
            paymentMethod === 'wallet'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
              : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-green-500/50'
          }`}
            onClick={() => setPaymentMethod('wallet')}
          >
            <div className="flex items-start gap-4">
              <input
                type="radio"
                name="payment"
                value="wallet"
                checked={paymentMethod === 'wallet'}
                readOnly
                className="w-5 h-5 mt-1 accent-green-500"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Ví điện tử</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Thanh toán qua Momo, ZaloPay, hoặc ví khác
                </p>
              </div>
              <span className="text-2xl">📱</span>
            </div>
          </div>

          {/* Bank Transfer */}
          <div className={`border-2 p-6 cursor-pointer transition-all rounded-xl ${
            paymentMethod === 'bank'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
              : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-green-500/50'
          }`}
            onClick={() => setPaymentMethod('bank')}
          >
            <div className="flex items-start gap-4">
              <input
                type="radio"
                name="payment"
                value="bank"
                checked={paymentMethod === 'bank'}
                readOnly
                className="w-5 h-5 mt-1 accent-green-500"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Chuyển khoản ngân hàng</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chuyển tiền trực tiếp từ tài khoản ngân hàng của bạn
                </p>
              </div>
              <span className="text-2xl">🏦</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl sticky top-24">
            <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Tóm tắt</h3>

            <div className="space-y-3 mb-6">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Sân bóng</p>
                <p className="font-medium text-gray-900 dark:text-white">Sân bóng Thế Vinh</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Thời gian</p>
                <p className="font-medium text-gray-900 dark:text-white">2024-01-15, 18:00</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-slate-700 pt-4 space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Giá sân</span>
                <span className="font-medium text-gray-900 dark:text-white">150.000 VND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phí dịch vụ</span>
                <span className="font-medium text-gray-900 dark:text-white">10.000 VND</span>
              </div>
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span>Tiền cọc đã trả</span>
                <span className="font-medium">-45.000 VND</span>
              </div>
              <div className="border-t border-gray-200 dark:border-slate-700 pt-4 flex justify-between">
                <span className="font-bold text-lg text-gray-900 dark:text-white">Cần thanh toán</span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                  {bookingAmount.toLocaleString()} VND
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
            </button>

            <Link href="/client/booking/confirm">
              <button className="w-full mt-3 px-4 py-2 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition font-medium">
                Quay lại
              </button>
            </Link>

            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-green-700 dark:text-green-400">
                ✓ Thanh toán an toàn và được bảo mật
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
