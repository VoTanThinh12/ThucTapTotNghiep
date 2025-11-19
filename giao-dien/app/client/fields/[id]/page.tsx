'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function FieldDetailPage() {
  const params = useParams()
  const fieldId = params.id
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedServices, setSelectedServices] = useState([])

  const field = {
    id: fieldId,
    name: 'Sân bóng Thế Vinh',
    location: 'Quận 1, TP HCM',
    type: '5v5',
    price: 150000,
    rating: 4.8,
    reviews: 128,
    description: 'Sân bóng mini chất lượng cao, được bảo trì thường xuyên',
    amenities: ['Bãi đỗ xe', 'Nhà vệ sinh', 'Quán nước', 'Khu thay đồ'],
    rules: ['Không mang giày có đinh', 'Cấm hút thuốc', 'Tuân thủ nội quy sân'],
    openTime: '06:00',
    closeTime: '23:00',
    phone: '0901234567',
    email: 'info@santhevinh.com',
  }

  const timeSlots = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      window.location.href = `/client/booking/confirm?fieldId=${fieldId}&date=${selectedDate}&time=${selectedTime}&services=${selectedServices.join(',')}`
    }
  }

  const handleServiceChange = (event) => {
    const value = event.target.value
    if (selectedServices.includes(value)) {
      setSelectedServices(selectedServices.filter(service => service !== value))
    } else {
      setSelectedServices([...selectedServices, value])
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/client/fields" className="hover:text-gray-900 dark:hover:text-white">
          Tìm sân
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">{field.name}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image */}
          <div className="bg-green-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-700 overflow-hidden mb-6 h-96 flex items-center justify-center rounded-xl">
            <span className="text-8xl">⚽</span>
          </div>

          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 mb-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {field.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{field.location}</p>
              </div>
              <div className="text-center bg-yellow-100 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-1 justify-center mb-1">
                  <span className="text-2xl text-yellow-500">★</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{field.rating}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {field.reviews} đánh giá
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Loại sân</p>
                <p className="font-bold text-lg text-gray-900 dark:text-white">{field.type}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Giờ hoạt động</p>
                <p className="font-bold text-sm text-gray-900 dark:text-white">
                  {field.openTime} - {field.closeTime}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Giá</p>
                <p className="font-bold text-lg text-green-600 dark:text-green-400">
                  {field.price.toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-gray-900 dark:text-white">{field.description}</p>
          </div>

          {/* Amenities */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 mb-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Tiện ích</h3>
            <div className="grid grid-cols-2 gap-3">
              {field.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-lg text-green-500">✓</span>
                  <span className="text-gray-900 dark:text-white">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 mb-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Dịch vụ bổ sung có sẵn</h3>
            
            {/* Equipment Category */}
            <div className="mb-6">
              <h4 className="font-medium text-sm text-blue-700 dark:text-blue-400 mb-3 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 rounded inline-block">
                🎽 Dụng cụ bóng đá
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {['Áo bib (5K)', 'Bóng thi đấu (Miễn phí)', 'Cọc chóp (Miễn phí)', 'Giày đá bóng (Cho thuê)'].map((item, i) => (
                  <label key={i} className="flex items-center gap-2 p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition">
                    <input
                      type="checkbox"
                      value={item}
                      onChange={handleServiceChange}
                      className="w-4 h-4 accent-green-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Beverage Category */}
            <div className="mb-6">
              <h4 className="font-medium text-sm text-orange-700 dark:text-orange-400 mb-3 px-3 py-1 bg-orange-100 dark:bg-orange-900/20 rounded inline-block">
                🥤 Nước uống & Đồ ăn
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {['Nước suối (10K)', 'Nước thể thao (20K)', 'Nước tăng lực (25K)', 'Khăn lạnh (5K)', 'Snack (15K)', 'Nước điện giải (20K)'].map((item, i) => (
                  <label key={i} className="flex items-center gap-2 p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition">
                    <input
                      type="checkbox"
                      value={item}
                      onChange={handleServiceChange}
                      className="w-4 h-4 accent-green-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Referee Service */}
            <div>
              <h4 className="font-medium text-sm text-purple-700 dark:text-purple-400 mb-3 px-3 py-1 bg-purple-100 dark:bg-purple-900/20 rounded inline-block">
                👨‍⚖️ Dịch vụ khác
              </h4>
              <label className="flex items-start gap-2 p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  value="Thuê trọng tài (200K)"
                  onChange={handleServiceChange}
                  className="w-4 h-4 mt-1 accent-green-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white block">Thuê trọng tài (200K)</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Cho giải đấu phong trào hoặc trận giao hữu</span>
                </div>
              </label>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Nội quy sân</h3>
            <ul className="space-y-2">
              {field.rules.map((rule, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <span className="text-lg">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Booking Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl sticky top-24">
            <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Đặt sân</h3>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chọn ngày
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Time Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Chọn giờ
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-2 text-sm font-medium rounded-md border transition-colors ${
                      selectedTime === time
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white hover:border-green-500'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {selectedDate && selectedTime && (
              <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ngày:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedDate}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Giờ:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedTime}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-slate-700 pt-4 flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-white">Tổng cộng:</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {field.price.toLocaleString()}
                  </span>
                </div>
                {selectedServices.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-2">Dịch vụ đã chọn:</h4>
                    <ul className="space-y-2">
                      {selectedServices.map((service, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-900 dark:text-white">
                          <span className="text-lg">•</span>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Booking Button */}
            <button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              Tiếp tục đặt sân
            </button>

            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">Liên hệ</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <a href={`tel:${field.phone}`} className="text-green-600 dark:text-green-400 hover:underline">
                    {field.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span>✉️</span>
                  <a href={`mailto:${field.email}`} className="text-green-600 dark:text-green-400 hover:underline">
                    {field.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl">
          <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Đánh giá từ khách hàng</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-200 dark:border-slate-700 pb-6 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Nguyễn Văn {String.fromCharCode(64 + i)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, j) => (
                        <span key={j} className="text-yellow-500">
                          {j < 5 - i ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">1 tuần trước</span>
                </div>
                <p className="text-gray-900 dark:text-white">Sân bóng rất đẹp, nhân viên thân thiện, sẽ quay lại sử dụng.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
