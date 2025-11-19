'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month')

  const stats = [
    { label: 'Tổng sân bóng', value: '12', change: '+2', trend: 'up', icon: '⚽' },
    { label: 'Đơn đặt hôm nay', value: '24', change: '+15%', trend: 'up', icon: '📅' },
    { label: 'Khách hàng', value: '1,250', change: '+8%', trend: 'up', icon: '👥' },
    { label: 'Doanh thu tháng', value: '45.5M', change: '+12%', trend: 'up', icon: '💰' },
  ]

  const chartData = [
    { date: '10/1', revenue: 3200, bookings: 12 },
    { date: '11/1', revenue: 2800, bookings: 10 },
    { date: '12/1', revenue: 4200, bookings: 15 },
    { date: '13/1', revenue: 3800, bookings: 14 },
    { date: '14/1', revenue: 5100, bookings: 18 },
    { date: '15/1', revenue: 4600, bookings: 16 },
    { date: '16/1', revenue: 5500, bookings: 20 },
    { date: '17/1', revenue: 6200, bookings: 22 },
    { date: '18/1', revenue: 5800, bookings: 20 },
  ]

  const recentBookings = [
    { id: 'BK001', customer: 'Nguyễn Văn A', field: 'Sân 1', time: '18:00', status: 'confirmed' },
    { id: 'BK002', customer: 'Trần Thị B', field: 'Sân 2', time: '19:30', status: 'pending' },
    { id: 'BK003', customer: 'Lê Văn C', field: 'Sân 3', time: '20:00', status: 'confirmed' },
    { id: 'BK004', customer: 'Phạm Văn D', field: 'Sân 5', time: '17:30', status: 'pending' },
    { id: 'BK005', customer: 'Hoàng Thị E', field: 'Sân 7', time: '21:00', status: 'confirmed' },
  ]

  const getStatusColor = (status: string) => {
    return status === 'confirmed' 
      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
      : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Tổng quan hoạt động của hệ thống quản lý sân bóng</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                stat.trend === 'up'
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Doanh thu & Đơn đặt</h3>
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                    dateRange === range
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {range === 'week' && '7 ngày'}
                  {range === 'month' && '30 ngày'}
                  {range === 'year' && '1 năm'}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2 px-2 py-8">
            {chartData.map((data, i) => {
              const maxRevenue = Math.max(...chartData.map(d => d.revenue))
              const height = (data.revenue / maxRevenue) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex items-end gap-1 h-40 w-full justify-center">
                    <div
                      className="bg-green-500 rounded-t-md flex-1 max-w-1/2 hover:opacity-80 transition-opacity"
                      style={{ height: `${height}%` }}
                      title={`${data.revenue / 1000}K`}
                    ></div>
                    <div
                      className="bg-amber-500 rounded-t-md flex-1 max-w-1/2 hover:opacity-80 transition-opacity"
                      style={{ height: `${(data.bookings / 25) * 100}%` }}
                      title={`${data.bookings} bookings`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{data.date}</span>
                </div>
              )
            })}
          </div>

          <div className="flex gap-6 justify-center mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-700 dark:text-gray-300">Doanh thu (VND)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-gray-700 dark:text-gray-300">Số lượng đơn</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl">
          <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Thông tin nhanh</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sân đang sử dụng</span>
                <span className="font-bold text-gray-900 dark:text-white">10/12</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '83%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Đơn chờ xác nhận</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">5</span>
              </div>
              <Link href="/admin/bookings?status=pending">
                <button className="w-full px-4 py-2 border-2 border-amber-500 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-500/10 transition font-medium text-sm">
                  Xem ngay
                </button>
              </Link>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sân cần bảo trì</span>
                <span className="font-bold text-red-600 dark:text-red-400">2</span>
              </div>
              <Link href="/admin/fields">
                <button className="w-full px-4 py-2 border-2 border-red-500 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition font-medium text-sm">
                  Quản lý sân
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Đơn đặt gần đây</h3>
          <Link href="/admin/bookings">
            <button className="px-4 py-2 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition font-medium text-sm">
              Xem tất cả
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Mã đơn</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Khách hàng</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Sân</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Giờ</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-green-600 dark:text-green-400">{booking.id}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{booking.customer}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{booking.field}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{booking.time}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-6 rounded-xl">
          <h3 className="font-bold text-lg mb-3 text-green-900 dark:text-green-100">Thêm sân mới</h3>
          <p className="text-sm text-green-700 dark:text-green-300 mb-4">
            Tạo thêm sân bóng mới vào hệ thống
          </p>
          <Link href="/admin/fields">
            <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium">
              Thêm sân
            </button>
          </Link>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-6 rounded-xl">
          <h3 className="font-bold text-lg mb-3 text-amber-900 dark:text-amber-100">Xác nhận đơn đặt</h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
            Xác nhận các đơn đặt chờ duyệt
          </p>
          <Link href="/admin/bookings?status=pending">
            <button className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-medium">
              Xác nhận
            </button>
          </Link>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-6 rounded-xl">
          <h3 className="font-bold text-lg mb-3 text-blue-900 dark:text-blue-100">Xem báo cáo</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
            Xem chi tiết báo cáo doanh thu và hiệu suất
          </p>
          <Link href="/admin/reports">
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium">
              Báo cáo
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
