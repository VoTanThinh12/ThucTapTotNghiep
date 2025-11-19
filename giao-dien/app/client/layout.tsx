import Link from 'next/link'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/client" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
              ⚽
            </div>
            <h1 className="text-xl font-bold text-green-700 dark:text-green-400">SoccerHub</h1>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/client/fields" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition">
              Tìm sân
            </Link>
            <Link href="/client/bookings" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition">
              Đơn đặt
            </Link>
            <Link href="/client/profile" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition">
              Tài khoản
            </Link>
            <button className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition">
              Đăng xuất
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Về SoccerHub</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#" className="hover:text-green-600 dark:hover:text-green-400">Về chúng tôi</Link></li>
                <li><Link href="#" className="hover:text-green-600 dark:hover:text-green-400">Blog</Link></li>
                <li><Link href="#" className="hover:text-green-600 dark:hover:text-green-400">Liên hệ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#" className="hover:text-green-600 dark:hover:text-green-400">Trợ giúp</Link></li>
                <li><Link href="#" className="hover:text-green-600 dark:hover:text-green-400">FAQ</Link></li>
                <li><Link href="#" className="hover:text-green-600 dark:hover:text-green-400">Liên hệ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Chính sách</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#" className="hover:text-green-600 dark:hover:text-green-400">Điều khoản</Link></li>
                <li><Link href="#" className="hover:text-green-600 dark:hover:text-green-400">Bảo mật</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Kết nối</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#" className="hover:text-green-600 dark:hover:text-green-400">Facebook</Link></li>
                <li><Link href="#" className="hover:text-green-600 dark:hover:text-green-400">Instagram</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-slate-800 pt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p>&copy; 2025 SoccerHub. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
