'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('customer')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userType === 'admin') {
      window.location.href = '/admin'
    } else {
      window.location.href = '/client'
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 p-4">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl font-bold text-white">⚽</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SoccerHub</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Đăng nhập để tiếp tục</p>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Selection */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="customer"
                checked={userType === 'customer'}
                onChange={(e) => setUserType(e.target.value)}
                className="w-4 h-4 accent-green-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Khách hàng</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="admin"
                checked={userType === 'admin'}
                onChange={(e) => setUserType(e.target.value)}
                className="w-4 h-4 accent-green-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quản trị viên</span>
            </label>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
          >
            Đăng nhập
          </button>

          {/* Signup Link */}
          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Chưa có tài khoản? </span>
            <Link href="/signup" className="text-green-600 dark:text-green-400 hover:underline font-medium">
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </div>

      {/* Demo Credentials */}
      <div className="mt-8 text-center text-xs text-gray-600 dark:text-gray-400 max-w-md">
        <p className="font-medium mb-2">Tài khoản demo:</p>
        <p>Khách hàng: customer@example.com / 123456</p>
        <p>Admin: admin@example.com / 123456</p>
      </div>
    </div>
  )
}
