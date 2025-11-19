import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
              ⚽
            </div>
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">SoccerHub</h1>
          </div>
          <nav className="flex gap-3">
            <Link href="/login" className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition">
              Đăng nhập
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
              Đăng ký
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                Đặt sân bóng mini chỉ trong vài phút
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Khám phá hàng trăm sân bóng mini gần bạn, xem giá cả, đặt lịch và thanh toán dễ dàng.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/client/fields" className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium">
                  Xem sân bóng
                </Link>
                <Link href="/signup" className="px-6 py-3 border-2 border-green-500 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-slate-800 transition font-medium">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-slate-800 dark:to-slate-900 rounded-xl h-96 flex items-center justify-center">
              <div className="text-8xl">⚽</div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🗓️', title: 'Đặt lịch dễ dàng', desc: 'Xem ngay giờ trống, đặt sân chỉ vài click' },
              { icon: '💰', title: 'Giá cạnh tranh', desc: 'So sánh giá của các sân, tìm ra deal tốt nhất' },
              { icon: '⭐', title: 'Đánh giá thực', desc: 'Xem nhận xét từ những người đã sử dụng dịch vụ' },
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 SoccerHub. Tất cả các quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  )
}
