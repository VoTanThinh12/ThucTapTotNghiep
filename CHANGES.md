# Các Thay Đổi Dự Án - Mini Football Management System

## 📋 Mục Đích Sửa Đổi

Dự án ban đầu được mô tả là "Website Đặt Lịch Sân Bóng Mini" nhưng thực tế nó **VỪA là nền tảng quản lý toàn diện VỪA là hệ thống đặt lịch trực tuyến**. 

Các sửa đổi này tuy rõ hóa vai trò thật của dự án và cập nhật tài liệu cho phù hợp.

## ✅ Các Thay Đổi Đã Hoàn Thành

### 1. Cập Nhật Package.json ✓
- **File**: `Server/package.json`
- **Thay đổi**: Đổi tên project từ `mini-football-backend` → `mini-football-management`
- **Lý do**: Phản ánh đúng chức năng của dự án

```json
"name": "mini-football-management"
```

### 2. Tạo README.md Toàn Diện ✓
- **File**: `README.md` (tại thư mục gốc)
- **Nội dung**:
  - ✅ Mô tả chi tiết dự án (quản lý + booking)
  - ✅ Tính năng cho khách hàng
  - ✅ Tính năng cho admin/manager
  - ✅ Công nghệ sử dụng
  - ✅ Cấu trúc dự án
  - ✅ Hướng dẫn cài đặt từng bước
  - ✅ Danh sách API endpoints
  - ✅ Cấu trúc database

## 📚 Chức Năng Của Dự Án

### Cho Khách Hàng (Customer)
```
✓ Tìm kiếm sân bóng
✓ Xem thông tin chi tiết sân
✓ Đặt lịch sân theo thời gian
✓ Xem giá theo khung giờ
✓ Quản lý hồ sơ cá nhân
✓ Theo dõi lịch sử đặt phòng
✓ Nhận thông báo cập nhật
```

### Cho Admin/Manager (Quản Lý)
```
✓ Quản lý danh sách sân bóng (CRUD)
✓ Quản lý thời gian khả dụng (time slots)
✓ Cấu hình giá theo khung giờ
✓ Quản lý danh sách khách hàng
✓ Xem và xác nhận đặt phòng
✓ Quản lý trạng thái đặt phòng
✓ Xem thống kê doanh thu
✓ Quản lý thông báo
```

## 🏗️ Cấu Trúc Database

**6 Bảng Chính:**

1. **users** - Tài khoản người dùng (admin, customer)
2. **customers** - Thông tin khách hàng
3. **pitches** - Thông tin sân bóng (tên, loại, vị trí, giá)
4. **bookings** - Lịch sử đặt phòng (trạng thái, giá, khách)
5. **priceslots** - Giá theo khung giờ
6. **notifications** - Thông báo cho khách hàng

## 🔗 API Routes

### Quản Lý Sân (Pitches)
- `GET /api/pitches` - Danh sách sân
- `GET /api/pitches/:id` - Chi tiết sân
- `POST /api/pitches` - Tạo sân (admin)
- `PUT /api/pitches/:id` - Cập nhật sân (admin)
- `DELETE /api/pitches/:id` - Xóa sân (admin)
- `GET /api/pitches/available-slots` - Xem thời gian khả dụng

### Quản Lý Khách Hàng (Customers)
- `GET /api/customers` - Danh sách khách (admin)
- `GET /api/customers/:id` - Chi tiết khách
- `PUT /api/customers/:id` - Cập nhật thông tin

### Quản Lý Đặt Lịch (Bookings)
- `POST /api/bookings` - Tạo đặt phòng (khách)
- `GET /api/bookings/my-bookings` - Lịch của tôi
- `GET /api/bookings` - Danh sách (admin)
- `PUT /api/bookings/:id` - Cập nhật (admin)
- `POST /api/bookings/:id/cancel` - Hủy đặt phòng
- `GET /api/bookings/stats` - Thống kê (admin)

### Xác Thực (Auth)
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

## 🛠️ Công Nghệ Stack

### Backend
- Node.js + Express.js
- MySQL / MariaDB
- JWT Authentication
- BCryptJS (mã hóa mật khẩu)
- Express Validator
- Multer (upload file)

### Frontend
- React.js
- Bootstrap
- Axios
- React Router

## 📁 Cấu Trúc Tệp

```
Server/
├── src/
│   ├── config/         - Cấu hình database
│   ├── controllers/    - Xử lý logic (pitch, booking, customer, auth)
│   ├── middleware/     - Auth, validation
│   ├── routes/        - API routes
│   ├── services/      - Business logic
│   └── utils/         - Tiện ích
├── schema.sql         - SQL structure
└── package.json
```

## 🎯 Lợi Thế Của Dự Án

1. **Hai Trong Một**: Vừa là hệ thống quản lý chuyên nghiệp VỪA là platform đặt lịch thân thiện với người dùng
2. **Đầy Đủ Chức Năng**: CRUD operations cho tất cả các entities
3. **Bảo Mật**: JWT authentication + password hashing
4. **Validation**: Dữ liệu được kiểm chứng ở cả client & server
5. **Thực Tế**: Thiết kế dựa trên nhu cầu thực tế của ngành
6. **Dễ Mở Rộng**: Architecture rõ ràng, dễ thêm tính năng mới

## 📝 Ghi Chú Quan Trọng

- **Booking Status**: pending → confirmed → completed (hoặc cancelled)
- **Time Slots**: Giá thay đổi theo khung giờ (6-9AM, 9-12PM, v.v.)
- **Pitch Types**: 5v5 hoặc 7v7
- **Customer Tracking**: Hệ thống theo dõi lịch sử đặt phòng và chi tiêu
- **Notifications**: Thông báo tự động khi có update về đặt phòng

## 🚀 Cách Sử Dụng

### Setup Backend
```bash
cd Server
npm install
cp .env.example .env
# Cấu hình .env file
mysql -u root -p < schema.sql
npm run dev
```

### Setup Frontend
```bash
cd client-react
npm install
npm start
```

## 📞 Liên Hệ

Nếu có câu hỏi về dự án, vui lòng liên hệ qua GitHub Issues.

---

**Cập nhật lần cuối**: November 14, 2025
**Phiên bản**: 1.0.0
