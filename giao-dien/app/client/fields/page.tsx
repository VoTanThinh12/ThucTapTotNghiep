'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Field {
  id: number
  name: string
  location: string
  type: string
  price: number
  rating: number
  openTime: string
  closeTime: string
  availability: number
}

const MOCK_FIELDS: Field[] = [
  { id: 1, name: 'Sân bóng Thế Vinh', location: 'Quận 1, TP HCM', type: '5v5', price: 150000, rating: 4.8, openTime: '06:00', closeTime: '23:00', availability: 8 },
  { id: 2, name: 'Sân bóng Kỷ Nguyên', location: 'Quận 3, TP HCM', type: '7v7', price: 200000, rating: 4.6, openTime: '07:00', closeTime: '22:00', availability: 5 },
  { id: 3, name: 'Sân bóng Bầu Trời', location: 'Quận 7, TP HCM', type: '5v5', price: 120000, rating: 4.4, openTime: '06:30', closeTime: '23:30', availability: 12 },
  { id: 4, name: 'Sân bóng Sao Vàng', location: 'Bình Thạnh, TP HCM', type: '7v7', price: 180000, rating: 4.7, openTime: '07:00', closeTime: '23:00', availability: 3 },
  { id: 5, name: 'Sân bóng Phương Hoàng', location: 'Quận 9, TP HCM', type: '5v5', price: 130000, rating: 4.5, openTime: '06:00', closeTime: '23:00', availability: 6 },
  { id: 6, name: 'Sân bóng Hải Giang', location: 'Tân Bình, TP HCM', type: '7v7', price: 190000, rating: 4.3, openTime: '07:30', closeTime: '22:30', availability: 4 },
  { id: 7, name: 'Sân bóng Cỏ Xanh', location: 'Quận 2, TP HCM', type: '5v5', price: 160000, rating: 4.9, openTime: '06:00', closeTime: '23:00', availability: 10 },
  { id: 8, name: 'Sân bóng Thiên Phúc', location: 'Quận 5, TP HCM', type: '7v7', price: 210000, rating: 4.6, openTime: '07:00', closeTime: '23:00', availability: 2 },
]

export default function FieldsPage() {
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    priceRange: 'all',
    sortBy: 'popular',
  })

  const filteredAndSortedFields = useMemo(() => {
    let results = [...MOCK_FIELDS]

    if (filters.search) {
      results = results.filter(
        (f) =>
          f.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          f.location.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.type !== 'all') {
      results = results.filter((f) => f.type === filters.type)
    }

    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number)
      results = results.filter((f) => f.price >= min && f.price <= max)
    }

    if (filters.sortBy === 'price-low') {
      results.sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === 'price-high') {
      results.sort((a, b) => b.price - a.price)
    } else if (filters.sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating)
    }

    return results
  }, [filters])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tìm sân bóng</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Khám phá {filteredAndSortedFields.length} sân bóng mini có sẵn
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl sticky top-24">
            <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Bộ lọc</h3>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                placeholder="Sân, địa điểm..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            {/* Field Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Loại sân
              </label>
              <div className="space-y-2">
                {['all', '5v5', '7v7'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={filters.type === type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {type === 'all' ? 'Tất cả' : type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Mức giá (VND/giờ)
              </label>
              <div className="space-y-2">
                {[
                  { label: 'Tất cả', value: 'all' },
                  { label: 'Dưới 150K', value: '0-150000' },
                  { label: '150K - 200K', value: '150000-200000' },
                  { label: 'Trên 200K', value: '200000-999999' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value={option.value}
                      checked={filters.priceRange === option.value}
                      onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sắp xếp
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="popular">Phổ biến nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="price-low">Giá thấp nhất</option>
                <option value="price-high">Giá cao nhất</option>
              </select>
            </div>

            <button
              onClick={() => setFilters({ search: '', type: 'all', priceRange: 'all', sortBy: 'popular' })}
              className="w-full mt-6 px-4 py-2 border-2 border-green-500 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10 transition font-medium text-sm"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Fields Grid */}
        <div className="lg:col-span-3">
          {filteredAndSortedFields.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-12 rounded-xl text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Không tìm thấy sân bóng phù hợp với tiêu chí tìm kiếm
              </p>
              <button
                onClick={() => setFilters({ search: '', type: 'all', priceRange: 'all', sortBy: 'popular' })}
                className="mt-4 px-6 py-2 border-2 border-green-500 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10 transition font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredAndSortedFields.map((field) => (
                <div
                  key={field.id}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Field Image */}
                  <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-slate-700 dark:to-slate-800 h-40 flex items-center justify-center">
                    <span className="text-4xl">⚽</span>
                  </div>

                  {/* Field Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                          {field.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {field.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{field.rating}</span>
                      </div>
                    </div>

                    {/* Field Details */}
                    <div className="flex items-center justify-between mb-4 py-3 border-t border-b border-gray-200 dark:border-slate-700">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Loại sân</p>
                        <p className="font-semibold text-green-600 dark:text-green-400">{field.type}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Giờ hoạt động</p>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                          {field.openTime} - {field.closeTime}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Trống</p>
                        <p className="font-semibold text-green-600 dark:text-green-400">{field.availability}</p>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {field.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">VND/giờ</p>
                      </div>
                      <Link href={`/client/fields/${field.id}`}>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium">
                          Đặt ngay
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
