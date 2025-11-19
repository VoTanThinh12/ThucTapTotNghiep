'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

interface Booking {
  id: string
  customer: string
  email: string
  phone: string
  field: string
  date: string
  time: string
  duration: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

const MOCK_BOOKINGS: Booking[] = [
  { id: 'BK001', customer: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0901234567', field: 'Sân bóng Thế Vinh', date: '2025-01-20', time: '18:00', duration: 1, totalPrice: 150000, status: 'pending', createdAt: '2025-01-18 10:30' },
  { id: 'BK002', customer: 'Trần Thị B', email: 'tranthib@example.com', phone: '0902345678', field: 'Sân bóng Kỷ Nguyên', date: '2025-01-21', time: '19:30', duration: 2, totalPrice: 400000, status: 'pending', createdAt: '2025-01-18 11:45' },
  { id: 'BK003', customer: 'Lê Văn C', email: 'levanc@example.com', phone: '0903456789', field: 'Sân bóng Bầu Trời', date: '2025-01-19', time: '20:00', duration: 1, totalPrice: 120000, status: 'confirmed', createdAt: '2025-01-17 14:20' },
  { id: 'BK004', customer: 'Phạm Văn D', email: 'phamvand@example.com', phone: '0904567890', field: 'Sân bóng Sao Vàng', date: '2025-01-15', time: '17:30', duration: 1, totalPrice: 180000, status: 'completed', createdAt: '2025-01-10 09:00' },
  { id: 'BK005', customer: 'Hoàng Thị E', email: 'hoangthe@example.com', phone: '0905678901', field: 'Sân bóng Phương Hoàng', date: '2025-01-05', time: '21:00', duration: 1, totalPrice: 130000, status: 'cancelled', createdAt: '2025-01-04 16:15' },
]

const getStatusBadge = (status: string) => {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', label: 'Chờ xác nhận' },
    confirmed: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', label: 'Đã xác nhận' },
    completed: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', label: 'Đã hoàn thành' },
    cancelled: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', label: 'Đã hủy' },
  }
  return badges[status]
}

export default function AdminBookingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>(
    (searchParams.get('status') as any) || 'all'
  )

  const filteredBookings = useMemo(() => {
    let results = [...bookings]

    if (searchTerm) {
      results = results.filter(
        (b) =>
          b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      results = results.filter((b) => b.status === filterStatus)
    }

    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [bookings, searchTerm, filterStatus])

  const handleConfirmBooking = (id: string) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: 'confirmed' as const } : b)))
  }

  const handleCancelBooking = (id: string) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b)))
  }

  const stats = [
    { label: 'Tổng đơn', value: bookings.length, icon: '📅' },
    { label: 'Chờ xác nhận', value: bookings.filter((b) => b.status === 'pending').length, icon: '⏳' },
    { label: 'Đã xác nhận', value: bookings.filter((b) => b.status === 'confirmed').length, icon: '✓' },
    { label: 'Đã hoàn thành', value: bookings.filter((b) => b.status === 'completed').length, icon: '✓✓' },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quản lý đơn đặt sân</h1>
        <p className="text-gray-600 dark:text-gray-400">Xác nhận, theo dõi và quản lý các đơn đặt sân</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 rounded-xl">
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc mã đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status as any)
                router.push(`?status=${status}`)
              }}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? 'bg-green-500 text-white'
                  : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-green-500 dark:hover:border-green-500'
              }`}
            >
              {status === 'all' && 'Tất cả'}
              {status === 'pending' && 'Chờ xác nhận'}
              {status === 'confirmed' && 'Đã xác nhận'}
              {status === 'completed' && 'Đã hoàn thành'}
              {status === 'cancelled' && 'Đã hủy'}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl overflow-x-auto">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Không tìm thấy đơn đặt sân phù hợp
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Mã đơn</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Khách hàng</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Sân</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Ngày & Giờ</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Giá</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Trạng thái</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const badge = getStatusBadge(booking.status)
                return (
                  <tr key={booking.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-4 px-4">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="font-mono font-bold text-green-600 dark:text-green-400 hover:underline"
                      >
                        {booking.id}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{booking.customer}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{booking.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white">{booking.field}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{new Date(booking.date).toLocaleDateString('vi-VN')}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{booking.time}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-green-600 dark:text-green-400">
                      {booking.totalPrice.toLocaleString()} VND
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2 flex-wrap">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirmBooking(booking.id)}
                              className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                            >
                              Xác nhận
                            </button>
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-medium rounded hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                            >
                              Hủy
                            </button>
                          </>
                        )}
                        <Link href={`/admin/bookings/${booking.id}`}>
                          <button className="px-3 py-1 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                            Chi tiết
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
