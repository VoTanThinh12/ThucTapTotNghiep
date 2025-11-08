const db = require('../config/database');

class BookingService {
  // Kiểm tra trùng lịch
  async checkAvailability(pitchId, date, startTime, duration) {
    const endTime = this.calculateEndTime(startTime, duration);
    
    const [bookings] = await db.query(
      `SELECT * FROM bookings 
       WHERE pitch_id = ? 
       AND booking_date = ? 
       AND status NOT IN ('cancelled')
       AND (
         (start_time < ? AND DATE_ADD(CONCAT(booking_date, ' ', start_time), INTERVAL duration HOUR) > ?) 
         OR (start_time >= ? AND start_time < ?)
       )`,
      [pitchId, date, endTime, startTime, startTime, endTime]
    );

    return bookings.length === 0;
  }

  // Tính giá dựa trên khung giờ
  async calculatePrice(pitchId, startTime, duration) {
    const [priceSlots] = await db.query(
      'SELECT time_slot, price FROM price_slots WHERE pitch_id = ?',
      [pitchId]
    );

    let totalPrice = 0;
    let currentTime = this.parseTime(startTime);
    const endTime = currentTime + duration;

    priceSlots.forEach(slot => {
      const [slotStart, slotEnd] = slot.time_slot.split('-').map(Number);
      
      const overlapStart = Math.max(currentTime, slotStart);
      const overlapEnd = Math.min(endTime, slotEnd);
      
      if (overlapStart < overlapEnd) {
        const overlapDuration = overlapEnd - overlapStart;
        totalPrice += slot.price * overlapDuration;
      }
    });

    return totalPrice;
  }

  // Tạo đơn đặt
  async createBooking(data) {
    const { pitchId, customerId, date, startTime, duration, totalPrice, note } = data;

    // Kiểm tra availability
    const available = await this.checkAvailability(pitchId, date, startTime, duration);
    if (!available) {
      throw new Error('Khung giờ này đã được đặt');
    }

    const [result] = await db.query(
      `INSERT INTO bookings (pitch_id, customer_id, booking_date, start_time, duration, total_price, note, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [pitchId, customerId, date, startTime, duration, totalPrice, note]
    );

    // Gửi thông báo
    await this.sendNotification(customerId, 'Đơn đặt sân của bạn đang chờ xác nhận', 'booking');

    return result.insertId;
  }

  // Cập nhật trạng thái đơn
  async updateBookingStatus(bookingId, status, adminNote = null) {
    const [result] = await db.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, bookingId]
    );

    // Lấy thông tin booking để gửi thông báo
    const [booking] = await db.query(
      'SELECT customer_id FROM bookings WHERE id = ?',
      [bookingId]
    );

    if (booking.length > 0) {
      let message = '';
      if (status === 'confirmed') {
        message = 'Đơn đặt sân của bạn đã được xác nhận';
      } else if (status === 'cancelled') {
        message = 'Đơn đặt sân của bạn đã bị hủy';
      } else if (status === 'completed') {
        message = 'Cảm ơn bạn đã sử dụng dịch vụ';
      }
      
      await this.sendNotification(booking[0].customer_id, message, 'booking');
    }

    return result.affectedRows > 0;
  }

  // Helper functions
  parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + minutes / 60;
  }

  calculateEndTime(startTime, duration) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + Math.floor(duration);
    const endMinutes = minutes + (duration % 1) * 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  }

  async sendNotification(customerId, message, type) {
    await db.query(
      'INSERT INTO notifications (customer_id, message, type) VALUES (?, ?, ?)',
      [customerId, message, type]
    );
  }
}

module.exports = new BookingService();
