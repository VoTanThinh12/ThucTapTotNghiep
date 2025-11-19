import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Quản lý sân', href: '/admin/fields', icon: '⚽' },
    { label: 'Đơn đặt sân', href: '/admin/bookings', icon: '📅' },
    { label: 'Khách hàng', href: '/admin/customers', icon: '👥' },
    { label: 'Dịch vụ', href: '/admin/services', icon: '🔧' },
    { label: 'Báo cáo', href: '/admin/reports', icon: '📈' },
    { label: 'Cài đặt', href: '/admin/settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 p-4 flex flex-col fixed h-screen">
        <Link href="/admin" className="flex items-center gap-2 mb-8 hover:opacity-80 transition">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
            ⚽
          </div>
          <h1 className="text-lg font-bold text-green-700 dark:text-green-400">SoccerHub Admin</h1>
        </Link>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 dark:border-slate-800 pt-4">
          <button className="w-full px-4 py-2 border-2 border-red-500 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition font-medium text-sm">
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400">Admin User</span>
              <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
