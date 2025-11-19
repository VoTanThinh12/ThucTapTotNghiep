'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'info' | 'bookings' | 'favorites' | 'settings'>('info')
  const [isEditingInfo, setIsEditingInfo] = useState(false)

  // Sample user data
  const user = {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0912345678',
    dateOfBirth: '1995-05-15',
    gender: 'Nam',
    address: '123 Đường Lê Lợi, Quận 1, TP HCM',
    avatar: '👤',
  }

  // Sample bookings
  const bookings = [
    { id: 'B001', field: 'Sân bóng 1', date: '2025-01-10', time: '19:00 - 20:30', status: 'confirmed', price: 150000 },
    { id: 'B002', field: 'Sân bóng 3', date: '2025-01-08', time: '18:00 - 19:30', status: 'completed', price: 150000 },
    { id: 'B003', field: 'Sân bóng 2', date: '2025-01-05', time: '17:00 - 18:30', status: 'completed', price: 150000 },
  ]

  // Sample favorites
  const favorites = [
    { id: '1', name: 'Sân bóng 1', location: 'Quận 1, TP HCM', price: '150.000 VND/giờ', rating: 4.5 },
    { id: '2', name: 'Sân bóng 3', location: 'Quận 3, TP HCM', price: '120.000 VND/giờ', rating: 4.3 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận'
      case 'completed':
        return 'Hoàn thành'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return 'Chưa xác định'
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-4xl">
              {user.avatar}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-3">{user.email}</p>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>📱 {user.phone}</span>
                <span>📍 {user.address}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditingInfo(!isEditingInfo)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
          >
            {isEditingInfo ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditingInfo && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Chỉnh sửa thông tin cá nhân</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Họ và tên</label>
              <input
                type="text"
                defaultValue={user.name}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Số điện thoại</label>
              <input
                type="tel"
                defaultValue={user.phone}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Ngày sinh</label>
              <input
                type="date"
                defaultValue={user.dateOfBirth}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Giới tính</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Nam</option>
                <option>Nữ</option>
                <option>Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Địa chỉ</label>
              <input
                type="text"
                defaultValue={user.address}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <button className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium">
            Lưu thay đổi
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-slate-700">
        {(['info', 'bookings', 'favorites', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === tab
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
            }`}
          >
            {tab === 'info' && 'Thông tin'}
            {tab === 'bookings' && 'Lịch sử đặt'}
            {tab === 'favorites' && 'Yêu thích'}
            {tab === 'settings' && 'Cài đặt'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Thông tin cá nhân</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-slate-700">
              <span className="text-gray-600 dark:text-gray-400">Họ và tên</span>
              <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-slate-700">
              <span className="text-gray-600 dark:text-gray-400">Email</span>
              <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-slate-700">
              <span className="text-gray-600 dark:text-gray-400">Số điện thoại</span>
              <span className="font-medium text-gray-900 dark:text-white">{user.phone}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-slate-700">
              <span className="text-gray-600 dark:text-gray-400">Ngày sinh</span>
              <span className="font-medium text-gray-900 dark:text-white">{user.dateOfBirth}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-slate-700">
              <span className="text-gray-600 dark:text-gray-400">Giới tính</span>
              <span className="font-medium text-gray-900 dark:text-white">{user.gender}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600 dark:text-gray-400">Địa chỉ</span>
              <span className="font-medium text-gray-900 dark:text-white">{user.address}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{booking.field}</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>📅 {booking.date}</div>
                      <div>⏰ {booking.time}</div>
                      <div>💰 {booking.price.toLocaleString()} VND</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                    <button className="px-4 py-2 border border-green-500 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10 transition text-sm font-medium">
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">Bạn chưa có đơn đặt nào</p>
              <Link href="/client/fields">
                <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium">
                  Đặt sân ngay
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <div key={fav.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{fav.name}</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>📍 {fav.location}</div>
                      <div>💰 {fav.price}</div>
                      <div>⭐ {fav.rating}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <button className="text-2xl hover:scale-110 transition">❤️</button>
                    <Link href={`/client/fields/${fav.id}`}>
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium">
                        Xem sân
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Bạn chưa yêu thích sân nào</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Thông báo</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Thông báo về đơn đặt</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Thông báo về khuyến mãi</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Thông báo qua email</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Bảo mật</h3>
            <button className="px-4 py-2 border border-green-500 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10 transition font-medium">
              Đổi mật khẩu
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Xóa tài khoản</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
            </p>
            <button className="px-4 py-2 border border-red-500 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition font-medium">
              Xóa tài khoản
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
