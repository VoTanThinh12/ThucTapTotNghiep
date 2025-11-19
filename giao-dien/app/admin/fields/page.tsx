'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Field {
  id: number
  name: string
  location: string
  type: string
  price: number
  status: 'active' | 'maintenance' | 'inactive'
  capacity: number
  openTime: string
  closeTime: string
  rating: number
}

interface TimeSlot {
  time: string
  status: 'available' | 'booked' | 'active' | 'closed'
}

const MOCK_FIELDS: Field[] = [
  { id: 1, name: 'Sân bóng Thế Vinh', location: 'Quận 1, TP HCM', type: '5v5', price: 150000, status: 'active', capacity: 10, openTime: '06:00', closeTime: '23:00', rating: 4.8 },
  { id: 2, name: 'Sân bóng Kỷ Nguyên', location: 'Quận 3, TP HCM', type: '7v7', price: 200000, status: 'active', capacity: 14, openTime: '07:00', closeTime: '22:00', rating: 4.6 },
  { id: 3, name: 'Sân bóng Bầu Trời', location: 'Quận 7, TP HCM', type: '5v5', price: 120000, status: 'maintenance', capacity: 10, openTime: '06:30', closeTime: '23:30', rating: 4.4 },
  { id: 4, name: 'Sân bóng Sao Vàng', location: 'Bình Thạnh, TP HCM', type: '7v7', price: 180000, status: 'active', capacity: 14, openTime: '07:00', closeTime: '23:00', rating: 4.7 },
]

const getStatusBadge = (status: string) => {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', label: 'Hoạt động' },
    maintenance: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', label: 'Bảo trì' },
    inactive: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', label: 'Tắt' },
  }
  return badges[status]
}

const generateTimeSlots = (openTime: string, closeTime: string): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const [openHour] = openTime.split(':').map(Number)
  const [closeHour] = closeTime.split(':').map(Number)
  const currentHour = new Date().getHours()
  const currentTime = new Date()

  for (let hour = openHour; hour < closeHour; hour++) {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`
    let slotStatus: 'available' | 'booked' | 'active' | 'closed' = 'available'

    if (hour < currentHour) {
      slotStatus = 'closed'
    } else if (hour === currentHour) {
      slotStatus = 'active'
    } else if (Math.random() > 0.6) {
      slotStatus = 'booked'
    }

    slots.push({ time: timeStr, status: slotStatus })
  }
  return slots
}

const getSlotStyle = (status: string) => {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    available: { bg: 'bg-green-50 dark:bg-green-900/20 border-green-300', text: 'text-green-700 dark:text-green-300', label: 'Chưa đặt' },
    booked: { bg: 'bg-red-50 dark:bg-red-900/20 border-red-300', text: 'text-red-700 dark:text-red-300', label: 'Đã đặt' },
    active: { bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300', text: 'text-blue-700 dark:text-blue-300', label: 'Đang hoạt động' },
    closed: { bg: 'bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600', text: 'text-gray-500 dark:text-gray-400', label: 'Đóng cửa' },
  }
  return styles[status]
}

export default function AdminFieldsPage() {
  const [fields] = useState<Field[]>(MOCK_FIELDS)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingField, setIsAddingField] = useState(false)
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null)

  const filteredFields = fields.filter(
    (f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           f.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedField = selectedFieldId ? fields.find(f => f.id === selectedFieldId) : null
  const timeSlots = selectedField ? generateTimeSlots(selectedField.openTime, selectedField.closeTime) : []

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quản lý sân bóng</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý danh sách sân bóng, giá cả, và khung giờ hoạt động
          </p>
        </div>
        <button
          onClick={() => setIsAddingField(!isAddingField)}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
        >
          + Thêm sân mới
        </button>
      </div>

      {/* Add New Field Form */}
      {isAddingField && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl">
          <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Thêm sân bóng mới</h3>
          <form className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên sân
              </label>
              <input
                type="text"
                placeholder="Nhập tên sân"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Địa điểm
              </label>
              <input
                type="text"
                placeholder="Nhập địa chỉ"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loại sân
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Chọn loại</option>
                <option value="5v5">5v5</option>
                <option value="7v7">7v7</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giá (VND/giờ)
              </label>
              <input
                type="number"
                placeholder="Nhập giá"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giờ mở cửa
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giờ đóng cửa
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sức chứa
              </label>
              <input
                type="number"
                placeholder="Số người"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                placeholder="Nhập số điện thoại"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
              >
                Thêm sân
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition font-medium"
                onClick={() => setIsAddingField(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm sân hoặc địa điểm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Fields Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Tên sân</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Địa điểm</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Loại</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Giá</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Trạng thái</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredFields.map((field) => {
                const badge = getStatusBadge(field.status)
                return (
                  <tr key={field.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => setSelectedFieldId(field.id)}>
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{field.name}</td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-sm">{field.location}</td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white">{field.type}</td>
                    <td className="py-4 px-4 font-bold text-green-600 dark:text-green-400 text-sm">
                      {field.price.toLocaleString()} VND
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/fields/${field.id}`}>
                          <button className="px-2 py-1 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                            Sửa
                          </button>
                        </Link>
                        <button className="px-2 py-1 border-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded text-xs hover:bg-red-50 dark:hover:bg-red-900/10 transition">
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {selectedField && (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Khung giờ</h3>
              <button
                onClick={() => setSelectedFieldId(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{selectedField.name}</p>

            {/* Legend */}
            <div className="mb-6 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 border border-green-300 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Chưa đặt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 dark:bg-red-900/20 border border-red-300 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Đã đặt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Đang hoạt động</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Đóng cửa</span>
              </div>
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => {
                const style = getSlotStyle(slot.status)
                return (
                  <div
                    key={slot.time}
                    className={`p-2 border-2 rounded-lg text-center cursor-pointer transition ${style.bg} ${style.text}`}
                  >
                    <div className="font-bold text-sm">{slot.time}</div>
                    <div className="text-xs">{style.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
