'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Booking {
  id: string
  fieldName: string
  location: string
  date: string
  time: string
  duration: number
  totalPrice: number
  status: 'completed' | 'upcoming' | 'cancelled'
  rating?: number
}

const MOCK_BOOKINGS: Booking[] = [
  { id: 'BK20250118001', fieldName: 'Sân bóng Thế Vinh', location: 'Quận 1, TP HCM', date: '2025-01-18', time: '18:00', duration: 1, totalPrice: 150000, status: 'upcoming' },
  { id: 'BK20250110002', fieldName: 'Sân bóng Kỷ Nguyên', location: 'Quận 3, TP HCM', date: '2025-01-10', time: '19:00', duration: 2, totalPrice: 400000, status: 'completed', rating: 5 },
  { id: 'BK20250105003', fieldName: 'Sân bóng Bầu Trời', location: 'Quận 7, TP HCM', date: '2025-01-05', time: '17:00', duration: 1, totalPrice: 120000, status: 'cancelled' },
]

const getStatusBadge = (status: string) => {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    upcoming: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', label: 'Sắp tới' },
    completed: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', label: 'Đã hoàn thành' },
    cancelled: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', label: 'Đã hủy' },
  }
  return badges[status]
}

export default function BookingsPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')

  const filteredBookings = filterStatus === 'all'
    ? MOCK_BOOKINGS
    : MOCK_BOOKINGS.filter((b) => b.status === filterStatus)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Đơn đặt sân của tôi</h1>
        <p className="text-gray-600 dark:text-gray-400">Quản lý và theo dõi các đơn đặt sân của bạn</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['all', 'upcoming', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-green-500 text-white'
                : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white hover:border-green-500'
            }`}
          >
            {status === 'all' && 'Tất cả'}
            {status === 'upcoming' && 'Sắp tới'}
            {status === 'completed' && 'Đã hoàn thành'}
            {status === 'cancelled' && 'Đã hủy'}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-12 text-center rounded-xl">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            Bạn chưa có đơn đặt sân nào ở danh mục này
          </p>
          <Link href="/client/fields">
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
              Tìm sân bóng
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const badge = getStatusBadge(booking.status)
            return (
              <div key={booking.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow rounded-xl">
                <div className="grid md:grid-cols-4 gap-6">
                  {/* Info */}
                  <div className="md:col-span-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      {booking.fieldName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{booking.location}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span className="text-gray-900 dark:text-white">{new Date(booking.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⏰</span>
                        <span className="text-gray-900 dark:text-white">{booking.time} ({booking.duration} giờ)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {booking.totalPrice.toLocaleString()} VND
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking ID & Status */}
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Mã đặt</p>
                    <p className="font-mono text-sm font-bold mb-4 text-gray-900 dark:text-white">{booking.id}</p>
                    <div className={`px-3 py-1 rounded-full inline-block ${badge.bg}`}>
                      <span className={`text-sm font-medium ${badge.text}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {booking.status === 'upcoming' && (
                      <>
                        <button className="px-4 py-2 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition font-medium text-sm">
                          Chỉnh sửa
                        </button>
                        <button className="px-4 py-2 border-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition font-medium text-sm">
                          Hủy đặt
                        </button>
                      </>
                    )}
                    {booking.status === 'completed' && (
                      <>
                        <button className="px-4 py-2 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition font-medium text-sm">
                          Xem chi tiết
                        </button>
                        {!booking.rating && (
                          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium text-sm">
                            Đánh giá
                          </button>
                        )}
                      </>
                    )}
                    {booking.status === 'cancelled' && (
                      <button className="px-4 py-2 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition font-medium text-sm">
                        Đặt lại
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
