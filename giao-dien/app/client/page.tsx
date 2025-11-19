import Link from 'next/link'

export default function ClientHome() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Search & Filter */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Tìm sân bóng gần bạn</h2>
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Địa điểm</label>
              <input
                type="text"
                placeholder="Nhập địa chỉ"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Ngày</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Loại sân</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Tất cả</option>
                <option>5v5</option>
                <option>7v7</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fields Grid */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Sân bóng nổi bật</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-slate-700 dark:to-slate-800 h-48 flex items-center justify-center">
                <span className="text-5xl">⚽</span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Sân bóng {i}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quận {i}, TP HCM</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-green-600 dark:text-green-400 text-lg">150.000 VND/giờ</span>
                  <span className="text-yellow-500">⭐ 4.5</span>
                </div>
                <Link href={`/client/fields/${i}`}>
                  <button className="w-full px-4 py-2 border-2 border-green-500 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10 transition font-medium">
                    Xem chi tiết
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
