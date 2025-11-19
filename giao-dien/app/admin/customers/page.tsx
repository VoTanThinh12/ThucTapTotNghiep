'use client'

import { useState } from 'react'

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  totalSpent: number
  bookings: number
  joinDate: string
  status: 'active' | 'inactive'
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0901234567', totalSpent: 1800000, bookings: 12, joinDate: '2024-06-15', status: 'active' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0902345678', totalSpent: 1200000, bookings: 8, joinDate: '2024-08-20', status: 'active' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', phone: '0903456789', totalSpent: 900000, bookings: 6, joinDate: '2024-09-10', status: 'active' },
  { id: 4, name: 'Phạm Văn D', email: 'phamvand@example.com', phone: '0904567890', totalSpent: 750000, bookings: 5, joinDate: '2024-10-05', status: 'inactive' },
  { id: 5, name: 'Hoàng Thị E', email: 'hoangthe@example.com', phone: '0905678901', totalSpent: 600000, bookings: 4, joinDate: '2024-11-12', status: 'active' },
]

export default function AdminCustomersPage() {
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    { label: 'Tổng khách hàng', value: customers.length, icon: '👥' },
    { label: 'Khách hoạt động', value: customers.filter((c) => c.status === 'active').length, icon: '✓' },
    { label: 'Tổng chi tiêu', value: `${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / 1000000).toFixed(1)}M`, icon: '💰' },
    { label: 'Trung bình/khách', value: `${Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length / 1000)}K`, icon: '📊' },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quản lý khách hàng</h1>
        <p className="text-gray-600 dark:text-gray-400">Quản lý danh sách khách hàng và lịch sử sử dụng dịch vụ</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 rounded-xl">
            <p className="text-lg mb-1">{stat.icon}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Khách hàng</th>
              <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Email</th>
              <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Điện thoại</th>
              <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Số lần đặt</th>
              <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Tổng chi</th>
              <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Ngày tham gia</th>
              <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{customer.name}</td>
                <td className="py-4 px-4">
                  <a href={`mailto:${customer.email}`} className="text-green-600 dark:text-green-400 hover:underline text-xs">
                    {customer.email}
                  </a>
                </td>
                <td className="py-4 px-4">
                  <a href={`tel:${customer.phone}`} className="text-green-600 dark:text-green-400 hover:underline">
                    {customer.phone}
                  </a>
                </td>
                <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">{customer.bookings}</td>
                <td className="py-4 px-4 font-bold text-green-600 dark:text-green-400">
                  {(customer.totalSpent / 1000000).toFixed(1)}M VND
                </td>
                <td className="py-4 px-4 text-xs text-gray-600 dark:text-gray-400">
                  {new Date(customer.joinDate).toLocaleDateString('vi-VN')}
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    customer.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400'
                  }`}>
                    {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
