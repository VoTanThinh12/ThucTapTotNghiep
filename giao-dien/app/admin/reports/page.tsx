'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState('revenue')

  const revenueData = [
    { field: 'Sân bóng Thế Vinh', bookings: 45, revenue: 6750000, utilization: '87%' },
    { field: 'Sân bóng Kỷ Nguyên', bookings: 38, revenue: 7600000, utilization: '82%' },
    { field: 'Sân bóng Bầu Trời', bookings: 42, revenue: 5040000, utilization: '78%' },
    { field: 'Sân bóng Sao Vàng', bookings: 35, revenue: 6300000, utilization: '75%' },
    { field: 'Sân bóng Phương Hoàng', bookings: 40, revenue: 5200000, utilization: '85%' },
  ]

  const monthlyStats = [
    { month: 'Tháng 1', revenue: '45.5M', bookings: 312, customers: 1250 },
    { month: 'Tháng 2', revenue: '52.3M', bookings: 356, customers: 1480 },
    { month: 'Tháng 3', revenue: '48.7M', bookings: 334, customers: 1320 },
    { month: 'Tháng 4', revenue: '61.2M', bookings: 418, customers: 1650 },
  ]

  const customerStats = [
    { name: 'Nguyễn Văn A', bookings: 12, spent: '1.8M', status: 'VIP' },
    { name: 'Trần Thị B', bookings: 8, spent: '1.2M', status: 'Thường xuyên' },
    { name: 'Lê Văn C', bookings: 6, spent: '900K', status: 'Thường xuyên' },
    { name: 'Phạm Văn D', bookings: 5, spent: '750K', status: 'Khách' },
    { name: 'Hoàng Thị E', bookings: 4, spent: '600K', status: 'Khách' },
  ]

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Báo cáo</h1>
        <p className="text-muted-foreground">Xem chi tiết báo cáo doanh thu, khách hàng và hiệu suất</p>
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-2 flex-wrap">
        {['revenue', 'monthly', 'customer'].map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              reportType === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:border-primary'
            }`}
          >
            {type === 'revenue' && 'Doanh thu theo sân'}
            {type === 'monthly' && 'Thống kê hàng tháng'}
            {type === 'customer' && 'Top khách hàng'}
          </button>
        ))}
      </div>

      {/* Revenue Report */}
      {reportType === 'revenue' && (
        <Card className="bg-card border border-border p-6">
          <h3 className="font-bold text-lg mb-6">Doanh thu theo sân</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-bold text-muted-foreground">Sân bóng</th>
                  <th className="text-left py-3 px-4 font-bold text-muted-foreground">Đơn đặt</th>
                  <th className="text-left py-3 px-4 font-bold text-muted-foreground">Doanh thu</th>
                  <th className="text-left py-3 px-4 font-bold text-muted-foreground">Mức sử dụng</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-medium">{row.field}</td>
                    <td className="py-4 px-4">{row.bookings}</td>
                    <td className="py-4 px-4 font-bold text-primary">
                      {(row.revenue / 1000000).toFixed(1)}M VND
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-full"
                            style={{ width: row.utilization }}
                          ></div>
                        </div>
                        <span className="font-medium text-sm">{row.utilization}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Monthly Stats */}
      {reportType === 'monthly' && (
        <Card className="bg-card border border-border p-6">
          <h3 className="font-bold text-lg mb-6">Thống kê hàng tháng</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-bold text-muted-foreground">Tháng</th>
                  <th className="text-left py-3 px-4 font-bold text-muted-foreground">Doanh thu</th>
                  <th className="text-left py-3 px-4 font-bold text-muted-foreground">Đơn đặt</th>
                  <th className="text-left py-3 px-4 font-bold text-muted-foreground">Khách hàng mới</th>
                </tr>
              </thead>
              <tbody>
                {monthlyStats.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-medium">{row.month}</td>
                    <td className="py-4 px-4 font-bold text-primary">{row.revenue}</td>
                    <td className="py-4 px-4">{row.bookings}</td>
                    <td className="py-4 px-4">{row.customers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Customer Stats */}
      {reportType === 'customer' && (
        <Card className="bg-card border border-border p-6">
          <h3 className="font-bold text-lg mb-6">Top khách hàng</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-bold text-muted-foreground">Khách hàng</th>
                  <th className="text-left py-3 px-4 font-bold text-muted-foreground">Số lần đặt</th>
                  <th className="text-left py-3 px-4 font-bold text-muted-foreground">Tổng chi tiêu</th>
                  <th className="text-left py-3 px-4 font-bold text-muted-foreground">Hạng</th>
                </tr>
              </thead>
              <tbody>
                {customerStats.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-medium">{row.name}</td>
                    <td className="py-4 px-4">{row.bookings}</td>
                    <td className="py-4 px-4 font-bold text-primary">{row.spent}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        row.status === 'VIP'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                          : row.status === 'Thường xuyên'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Export Options */}
      <Card className="bg-secondary/10 border border-secondary/20 p-6">
        <h3 className="font-bold text-lg mb-4">Tải báo cáo</h3>
        <div className="flex gap-3 flex-wrap">
          <Button className="bg-primary hover:bg-primary/90">
            Tải PDF
          </Button>
          <Button variant="outline">
            Tải Excel
          </Button>
          <Button variant="outline">
            In báo cáo
          </Button>
        </div>
      </Card>
    </div>
  )
}
