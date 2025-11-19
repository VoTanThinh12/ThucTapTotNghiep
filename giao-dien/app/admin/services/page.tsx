'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Service {
  id: number
  name: string
  category: 'equipment' | 'beverage' | 'referee'
  price: number
  description: string
  availability: number
  status: 'active' | 'inactive'
  fields: number[]
}

const SERVICE_CATEGORIES = {
  equipment: {
    label: 'Dụng cụ bóng đá',
    color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    items: ['Áo bib', 'Bóng thi đấu', 'Cọc chóp', 'Giày đá bóng', 'Ống đồng']
  },
  beverage: {
    label: 'Nước uống & Đồ ăn',
    color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
    items: ['Nước suối', 'Nước thể thao', 'Nước tăng lực', 'Khăn lạnh', 'Snack', 'Nước điện giải']
  },
  referee: {
    label: 'Dịch vụ khác',
    color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
    items: ['Thuê trọng tài cho giải đấu phong trào', 'Thuê trọng tài cho trận giao hữu']
  }
}

const MOCK_SERVICES: Service[] = [
  { id: 1, name: 'Áo bib', category: 'equipment', price: 5000, description: 'Bộ áo phân đội màu khác nhau', availability: 50, status: 'active', fields: [1, 2, 3] },
  { id: 2, name: 'Bóng thi đấu', category: 'equipment', price: 0, description: 'Bóng FIFA chính hãng', availability: 20, status: 'active', fields: [1, 2, 3, 4] },
  { id: 3, name: 'Nước suối', category: 'beverage', price: 10000, description: 'Nước suối sạch 500ml', availability: 100, status: 'active', fields: [1, 2, 3, 4, 5] },
  { id: 4, name: 'Nước thể thao', category: 'beverage', price: 20000, description: 'Nước thể thao Pocari/Aquarius 500ml', availability: 80, status: 'active', fields: [2, 3, 4] },
  { id: 5, name: 'Thuê trọng tài', category: 'referee', price: 200000, description: 'Trọng tài có kinh nghiệm cho trận đấu', availability: 5, status: 'active', fields: [1, 2, 3, 4, 5] },
]

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<'all' | 'equipment' | 'beverage' | 'referee'>('all')
  const [isAddingService, setIsAddingService] = useState(false)
  const [newService, setNewService] = useState({ name: '', category: 'equipment' as const, price: 0, description: '' })

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || s.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAddService = () => {
    if (newService.name && newService.price >= 0) {
      setServices([...services, {
        id: Math.max(...services.map(s => s.id)) + 1,
        ...newService,
        availability: 0,
        status: 'active',
        fields: []
      }])
      setNewService({ name: '', category: 'equipment', price: 0, description: '' })
      setIsAddingService(false)
    }
  }

  const handleToggleStatus = (id: number) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
    ))
  }

  const stats = [
    { label: 'Tổng dịch vụ', value: services.length, icon: '🔧' },
    { label: 'Dịch vụ hoạt động', value: services.filter(s => s.status === 'active').length, icon: '✓' },
    { label: 'Dụng cụ', value: services.filter(s => s.category === 'equipment').length, icon: '⚽' },
    { label: 'Nước & Đồ ăn', value: services.filter(s => s.category === 'beverage').length, icon: '🥤' },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quản lý dịch vụ bổ sung</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý các dịch vụ thêm có sẵn tại sân
          </p>
        </div>
        <button
          onClick={() => setIsAddingService(!isAddingService)}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
        >
          + Thêm dịch vụ
        </button>
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

      {/* Add Service Form */}
      {isAddingService && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl">
          <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Thêm dịch vụ mới</h3>
          <form className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên dịch vụ
              </label>
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                placeholder="Nhập tên dịch vụ"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Danh mục
              </label>
              <select 
                value={newService.category}
                onChange={(e) => setNewService({ ...newService, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="equipment">Dụng cụ bóng đá</option>
                <option value="beverage">Nước uống & Đồ ăn</option>
                <option value="referee">Dịch vụ khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giá (VND)
              </label>
              <input
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mô tả
              </label>
              <input
                type="text"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="Mô tả dịch vụ"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="button"
                onClick={handleAddService}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
              >
                Thêm dịch vụ
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition font-medium"
                onClick={() => setIsAddingService(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['all', 'equipment', 'beverage', 'referee'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-green-500 text-white'
                  : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-green-500'
              }`}
            >
              {cat === 'all' && 'Tất cả'}
              {cat === 'equipment' && 'Dụng cụ'}
              {cat === 'beverage' && 'Nước & Đồ ăn'}
              {cat === 'referee' && 'Dịch vụ khác'}
            </button>
          ))}
        </div>
      </div>

      {/* Services by Category */}
      <div className="space-y-8">
        {Object.entries(SERVICE_CATEGORIES).map(([category, catInfo]) => {
          const catServices = filteredServices.filter(s => s.category === category as any)
          if (catServices.length === 0) return null

          return (
            <div key={category}>
              <h3 className={`font-bold text-lg mb-4 px-4 py-2 rounded-lg inline-block ${catInfo.color}`}>
                {catInfo.label}
              </h3>
              
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                        <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Dịch vụ</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Mô tả</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Giá</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Sân</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Trạng thái</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-600 dark:text-gray-400">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {catServices.map((service) => (
                        <tr key={service.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{service.name}</td>
                          <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{service.description}</td>
                          <td className="py-4 px-4 font-bold text-green-600 dark:text-green-400">
                            {service.price === 0 ? 'Miễn phí' : `${service.price.toLocaleString()} VND`}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{service.fields.length} sân</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              service.status === 'active'
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400'
                            }`}>
                              {service.status === 'active' ? 'Hoạt động' : 'Tắt'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleStatus(service.id)}
                                className={`px-3 py-1 text-xs font-medium rounded border transition-colors ${
                                  service.status === 'active'
                                    ? 'border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10'
                                    : 'border-green-300 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/10'
                                }`}
                              >
                                {service.status === 'active' ? 'Tắt' : 'Bật'}
                              </button>
                              <button className="px-3 py-1 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                                Sửa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
