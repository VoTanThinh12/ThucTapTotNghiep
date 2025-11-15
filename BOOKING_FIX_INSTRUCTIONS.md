# Cách Sửa Lỗi Đặt Sân (NaN Error)

## Vấn Đề

Lỗi `Unknown column 'NaN' in 'field list'` xảy ra khi đặt sân vì:

1. **Frontend gửi sai dữ liệu**: Frontend gửi `startTime` (string) thay vì `time_slot_id` (number)
2. **Backend tìm sai bảng**: Code backend tìm kiếm trong bảng `price_slots` (không tồn tại) thay vì `time_slots`
3. **Tính giá thất bại**: Vì không tìm thấy giá, biến `total_price` trở thành `NaN`

## Đã Sửa ở Backend

### 1. `bookingController.js` - Đã cập nhật

✅ Thay đổi `start_time` thành `time_slot_id`
✅ Tìm kiếm trong bảng `time_slots` thay vì `price_slots`
✅ Thêm validation đầy đủ cho `time_slot_id`
✅ Kiểm tra giá hợp lệ trước khi tính toán
✅ Cập nhật theo cấu trúc database schema

### 2. `pitchController.js` - Đã cập nhật

✅ Thay đổi `price_slots` thành `time_slots`
✅ Thêm function `getPitchTimeSlots()` mới
✅ Cập nhật `getAvailableSlots()` để dùng `time_slots`

### 3. `pitches.js` (routes) - Đã cập nhật

✅ Thêm route `GET /pitches/:id/time-slots`

## Cần Sửa ở Frontend

### Bước 1: Cập nhật `pitchService.js`

Thêm function mới để lấy time slots:

```javascript
// client-react/src/services/pitchService.js

const pitchService = {
  // ... các function hiện tại ...
  
  // THÊM FUNCTION MỚI NÀY
  getPitchTimeSlots: async (pitchId, date = null) => {
    const params = date ? { date } : {};
    return await api.get(`/pitches/${pitchId}/time-slots`, { params });
  },
};

export default pitchService;
```

### Bước 2: Cập nhật `BookingPage.jsx`

Thay đổi hoàn toàn cách chọn thời gian:

```javascript
// client-react/src/pages/client/BookingPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pitchService } from '../../services/pitchService';
import { bookingService } from '../../services/bookingService';
import { toast } from 'react-toastify';

const BookingPage = () => {
  const { pitchId } = useParams();
  const navigate = useNavigate();
  const [pitch, setPitch] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    booking_date: '',
    time_slot_id: '',
    duration: 1,
    notes: '',
    team_a_name: '',
    team_b_name: ''
  });

  useEffect(() => {
    fetchPitch();
  }, [pitchId]);

  useEffect(() => {
    if (formData.booking_date) {
      fetchTimeSlots();
    }
  }, [formData.booking_date]);

  const fetchPitch = async () => {
    try {
      const response = await pitchService.getPitchById(pitchId);
      setPitch(response.data.pitch);
    } catch (error) {
      toast.error('Không tìm thấy sân');
      navigate('/pitches');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await pitchService.getPitchTimeSlots(pitchId, formData.booking_date);
      setTimeSlots(response.data.time_slots);
    } catch (error) {
      toast.error('Không lấy được khung giờ');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.time_slot_id) {
      toast.error('Vui lòng chọn khung giờ');
      return;
    }

    try {
      await bookingService.createBooking({
        pitch_id: parseInt(pitchId),
        ...formData,
        time_slot_id: parseInt(formData.time_slot_id)
      });
      
      toast.success('Đặt sân thành công!');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đặt sân thất bại');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Đặt sân: {pitch.name}</h1>

          {/* Thông tin sân */}
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700">📍 {pitch.location}</p>
            <p className="text-gray-700">🏟️ Loại sân: {pitch.pitch_type}</p>
            <p className="text-gray-700">⏰ {pitch.open_time} - {pitch.close_time}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Chọn ngày */}
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Ngày đặt *</label>
              <input
                type="date"
                value={formData.booking_date}
                onChange={(e) => setFormData({ ...formData, booking_date: e.target.value, time_slot_id: '' })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Chọn khung giờ */}
            {formData.booking_date && (
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Chọn khung giờ *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {timeSlots.map(slot => (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={slot.is_booked}
                      onClick={() => setFormData({ ...formData, time_slot_id: slot.id })}
                      className={`p-4 rounded-lg border-2 text-left ${
                        slot.is_booked
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                          : formData.time_slot_id === slot.id
                          ? 'bg-green-100 border-green-500'
                          : 'bg-white border-gray-300 hover:border-green-400'
                      }`}
                    >
                      <div className="font-semibold">{slot.slot_name}</div>
                      <div className="text-sm text-gray-600">
                        {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                      </div>
                      <div className="text-green-600 font-bold">
                        {slot.price.toLocaleString('vi-VN')} đ
                      </div>
                      {slot.is_booked && (
                        <div className="text-red-500 text-xs mt-1">Đã đặt</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Thời lượng (nếu cần) */}
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Thời lượng (giờ)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Tên đội */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Tên đội A</label>
                <input
                  type="text"
                  value={formData.team_a_name}
                  onChange={(e) => setFormData({ ...formData, team_a_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Tên đội B</label>
                <input
                  type="text"
                  value={formData.team_b_name}
                  onChange={(e) => setFormData({ ...formData, team_b_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block text-gray-700 mb-2">Ghi chú</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
              />
            </div>

            {/* Hiển thị giá */}
            {formData.time_slot_id && (
              <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
                {(() => {
                  const selectedSlot = timeSlots.find(s => s.id === formData.time_slot_id);
                  const totalPrice = selectedSlot ? selectedSlot.price * formData.duration : 0;
                  return (
                    <>
                      <p className="text-2xl font-bold text-gray-800 text-center">
                        Tổng tiền: {totalPrice.toLocaleString('vi-VN')} VNĐ
                      </p>
                      <p className="text-sm text-gray-600 text-center mt-2">
                        (Cần đặt cọc 30% = {(totalPrice * 0.3).toLocaleString('vi-VN')} VNĐ)
                      </p>
                    </>
                  );
                })()}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
            >
              Xác nhận đặt sân
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
```

### Bước 3: Cập nhật `bookingService.js`

Không cần thay đổi - service đã đúng!

## Kiểm Tra

1. **Khởi động lại server**:
   ```bash
   cd Server
   npm start
   ```

2. **Khởi động frontend**:
   ```bash
   cd client-react
   npm start
   ```

3. **Kiểm tra flow**:
   - Mở trang đặt sân
   - Chọn ngày
   - Chọn khung giờ (sẽ hiển thị các slot khả dụng)
   - Nhập thông tin và đặt sân
   - Kiểm tra console - không còn lỗi NaN!

## Tóm Tắt Thay Đổi

| Frontend Trước | Frontend Sau |
|-----------------|-------------|
| `startTime` (string) | `time_slot_id` (number) |
| Nhập thời gian thủ công | Chọn từ danh sách slots |
| Tính giá bằng API riêng biệt | Giá đã có trong time_slot |

## Các Trường Dữ Liệu Mới

```javascript
// Dữ liệu gửi lên API /bookings (POST)
{
  pitch_id: 1,              // ID sân
  booking_date: "2025-11-15", // Ngày đặt
  time_slot_id: 3,          // ID khung giờ (TỪ bảng time_slots)
  duration: 2,               // Thời lượng (giờ)
  notes: "Ghi chú...",     // Ghi chú
  team_a_name: "Đội A",     // Tên đội A (optional)
  team_b_name: "Đội B"      // Tên đội B (optional)
}
```

## Database Schema

```sql
-- Bảng time_slots chứa thông tin khung giờ
CREATE TABLE time_slots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pitch_id INT NOT NULL,
  slot_name VARCHAR(50) NOT NULL,  -- Ví dụ: "06:00-09:00"
  start_time TIME NOT NULL,         -- 06:00:00
  end_time TIME NOT NULL,           -- 09:00:00
  price DECIMAL(15,2) NOT NULL,     -- 350000
  is_available TINYINT DEFAULT 1,
  FOREIGN KEY (pitch_id) REFERENCES pitches(id)
);

-- Bảng bookings lưu thông tin đặt sân
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pitch_id INT NOT NULL,
  customer_id INT NOT NULL,
  booking_date DATE NOT NULL,
  time_slot_id INT NOT NULL,        -- Liên kết với time_slots
  duration INT,                      -- Thời lượng (phút)
  total_price DECIMAL(15,2) NOT NULL,
  deposit_paid DECIMAL(15,2) DEFAULT 0,
  remaining_payment DECIMAL(15,2) NOT NULL,
  payment_status ENUM('unpaid', 'partial', 'paid') DEFAULT 'unpaid',
  booking_status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  team_a_name VARCHAR(100),
  team_b_name VARCHAR(100),
  notes TEXT,
  FOREIGN KEY (time_slot_id) REFERENCES time_slots(id)
);
```

## Lưu Ý

- Backend ĐÃ SỬA XONG
- Cần cập nhật Frontend theo hướng dẫn trên
- Sau khi sửa xong, nhớ restart cả backend và frontend
- Test kỹ trước khi deploy!