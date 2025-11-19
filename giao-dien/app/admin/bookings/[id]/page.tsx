'use client'

import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id

  // Mock booking data
  const booking = {
    id: bookingId,
    customer: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    field: 'Sân bóng Thế Vinh',
    fieldLocation: 'Quận 1, TP HCM',
    date: '2025-01-20',
    time: '18:00',
    duration: 1,
    totalPrice: 150000,
    depositPrice: 45000,
    status: 'pending',
    createdAt: '2025-01-18 10:30',
    notes: 'Sẽ có 8 người',
  }

  const handleConfirm = () => {
    alert('Đơn đặt đã được xác nhận!')
    router.push('/admin/bookings')
  }

  const handleCancel = () => {
    if (confirm('Bạn có chắc muốn hủy đơn đặt này?')) {
      alert('Đơn đặt đã bị hủy!')
      router.push('/admin/bookings')
    }
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/bookings" className="hover:text-foreground">
          Quản lý đơn đặt
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{booking.id}</span>
      </div>

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Chi tiết đơn đặt {booking.id}
          </h1>
          <p className="text-muted-foreground">
            Xem và quản lý thông tin chi tiết đơn đặt sân
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg font-medium ${
          booking.status === 'pending'
            ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
            : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
        }`}>
          {booking.status === 'pending' ? 'Chờ xác nhận' : 'Đã xác nhận'}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Info */}
          <Card className="bg-card border border-border p-6">
            <h3 className="font-bold text-lg mb-6">Thông tin đơn đặt</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mã đơn</p>
                  <p className="font-bold text-lg text-primary">{booking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ngày tạo</p>
                  <p className="font-medium">{booking.createdAt}</p>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-1">Sân bóng</p>
                <p className="font-bold text-lg">{booking.field}</p>
                <p className="text-sm text-muted-foreground">{booking.fieldLocation}</p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-1">Thời gian</p>
                <p className="font-bold text-lg">
                  {new Date(booking.date).toLocaleDateString('vi-VN')}, {booking.time}
                </p>
                <p className="text-sm text-muted-foreground">Thời lượng: {booking.duration} giờ</p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                <p className="text-foreground">{booking.notes || 'Không có ghi chú'}</p>
              </div>
            </div>
          </Card>

          {/* Customer Info */}
          <Card className="bg-card border border-border p-6">
            <h3 className="font-bold text-lg mb-6">Thông tin khách hàng</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tên khách hàng</p>
                <p className="font-medium text-lg">{booking.customer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <a href={`mailto:${booking.email}`} className="text-primary hover:underline">
                  {booking.email}
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Điện thoại</p>
                <a href={`tel:${booking.phone}`} className="text-primary hover:underline">
                  {booking.phone}
                </a>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Price Summary */}
          <Card className="bg-card border border-border p-6">
            <h3 className="font-bold text-lg mb-6">Tóm tắt thanh toán</h3>
            <div className="space-y-3">
              <div className="flex justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Giá sân/giờ</span>
                <span className="font-medium">150.000 VND</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Thời lượng</span>
                <span className="font-medium">{booking.duration} giờ</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Tổng tiền</span>
                <span className="font-bold text-primary">
                  {booking.totalPrice.toLocaleString()} VND
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Tiền cọc</span>
                <span className="font-medium text-destructive">
                  {booking.depositPrice.toLocaleString()} VND
                </span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="font-bold">Còn lại</span>
                <span className="font-bold text-lg text-primary">
                  {(booking.totalPrice - booking.depositPrice).toLocaleString()} VND
                </span>
              </div>
            </div>
          </Card>

          {/* Payment Status */}
          <Card className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6">
            <p className="text-sm font-bold text-green-700 dark:text-green-400 mb-2">
              ✓ Tiền cọc đã thanh toán
            </p>
            <p className="text-xs text-green-600 dark:text-green-500">
              {booking.depositPrice.toLocaleString()} VND
            </p>
          </Card>

          {/* Actions */}
          {booking.status === 'pending' && (
            <div className="space-y-3">
              <Button
                onClick={handleConfirm}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Xác nhận đơn đặt
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
              >
                Hủy đơn đặt
              </Button>
            </div>
          )}

          {booking.status !== 'pending' && (
            <Card className="bg-secondary/10 border border-secondary/20 p-4 text-center">
              <p className="text-sm font-medium text-foreground">Đơn đặt đã xác nhận</p>
            </Card>
          )}

          {/* Contact Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => window.location.href = `tel:${booking.phone}`}
            >
              📞 Gọi khách hàng
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => window.location.href = `mailto:${booking.email}`}
            >
              ✉️ Gửi email
            </Button>
          </div>

          {/* Back Button */}
          <Link href="/admin/bookings" className="w-full">
            <Button variant="outline" className="w-full">
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
