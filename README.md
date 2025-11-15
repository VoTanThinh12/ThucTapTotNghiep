# Mini Football Management System

Website Quản lý Sân Bóng Mini - Hệ thống quản lý toàn diện cho các sân bóng mini, với chức năng đặt lịch, quản lý sân, khách hàng và thanh toán.

**Website này vừa là hệ thống quản lý toàn diện VỪA là nền tảng đặt lịch trực tuyến cho khách hàng.**

## 🎯 Tính Năng Chính

### Cho Khách Hàng (Customer)
- 🔍 Tìm kiếm và xem thông tin sân bóng
- 📅 Đặt lịch sân bóng dễ dàng
- 💰 Xem giá và thời gian khả dụng
- 👤 Quản lý hồ sơ cá nhân
- 📞 Theo dõi lịch sử đặt phòng
- 🔔 Nhận thông báo cập nhật

### Cho Quản Lý (Admin/Manager)
- 📊 Quản lý danh sách sân bóng
- ⏰ Quản lý thời gian khả dụng (time slots)
- 💵 Cấu hình giá theo khung giờ
- 👥 Quản lý danh sách khách hàng
- 📋 Xem và xác nhận đặt phòng
- 📈 Xem thống kê doanh thu
- 🎯 Quản lý trạng thái đặt phòng (pending, confirmed, cancelled, completed)

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Node.js + Express.js** - REST API Server
- **MySQL + MariaDB** - Cơ sở dữ liệu
- **JWT Authentication** - Xác thực người dùng
- **BCryptJS** - Mã hóa mật khẩu
- **CORS** - Cross-origin support
- **Express Validator** - Xác thực dữ liệu
- **Multer** - Upload file hình ảnh

### Frontend
- **React.js** - UI Framework
- **React Router** - Điều hướng
- **Bootstrap** - CSS Framework
- **Axios** - HTTP Client

### Database
- **MySQL 8.0** / **MariaDB 10.4**
- 5 bảng chính: users, customers, pitches, bookings, priceslots, notifications

## 📁 Cấu Trúc Dự Án

```
ThucTapTotNghiep/
├── Server/                      # Backend
│   ├── src/
│   │   ├── server.js           # Entry point
│   │   ├── config/             # Cấu hình database
│   │   ├── controllers/        # Xử lý logic business
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Auth, validation
│   │   ├── services/           # Business logic
│   │   └── utils/              # Tiện ích
│   ├── schema.sql              # SQL structure
│   └── package.json
│
└── client-react/               # Frontend
    ├── src/
    │   ├── pages/              # Trang chính
    │   ├── components/         # React components
    │   ├── services/           # API calls
    │   └── App.js              # Entry point
    └── package.json
```

## 🚀 Cách Cài Đặt

### Yêu Cầu
- Node.js >= 16.0
- MySQL / MariaDB
- npm hoặc yarn

### Backend Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/VoTanThinh12/ThucTapTotNghiep.git
   cd ThucTapTotNghiep/Server
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Tạo file .env**
   ```bash
   cp .env.example .env
   ```
   
   Cấu hình các biến môi trường:
   ```env
   CORS_ORIGIN=http://localhost:3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=mini_football
   PORT=5000
   JWT_SECRET=your_secret_key
   ```

4. **Tạo database**
   ```bash
   mysql -u root -p < schema.sql
   ```

5. **Chạy server**
   ```bash
   npm start          # Production
   npm run dev        # Development (with nodemon)
   ```

### Frontend Setup

1. **Vào thư mục client**
   ```bash
   cd ../client-react
   npm install
   ```

2. **Tạo file .env**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

3. **Chạy React app**
   ```bash
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### Pitches (Sân Bóng)
- `GET /api/pitches` - Danh sách sân
- `GET /api/pitches/:id` - Chi tiết sân
- `POST /api/pitches` - Tạo sân (admin)
- `PUT /api/pitches/:id` - Cập nhật sân (admin)
- `DELETE /api/pitches/:id` - Xóa sân (admin)

### Bookings (Đặt Lịch)
- `GET /api/bookings/my-bookings` - Lịch của tôi
- `POST /api/bookings` - Tạo đặt phòng
- `GET /api/bookings` - Danh sách (admin)
- `PUT /api/bookings/:id` - Cập nhật (admin)
- `POST /api/bookings/:id/cancel` - Hủy đặt phòng

### Customers (Khách Hàng)
- `GET /api/customers` - Danh sách (admin)
- `GET /api/customers/:id` - Chi tiết
- `PUT /api/customers/:id` - Cập nhật

## 🗄️ Cấu Trúc Database

### Bảng Users
- Lưu tài khoản người dùng (admin, customer)

### Bảng Customers
- Thông tin khách hàng
- Liên kết với users

### Bảng Pitches
- Thông tin sân bóng
- Loại sân (5v5, 7v7)
- Giá min/max
- Rating và reviews

### Bảng Bookings
- Lịch sử đặt phòng
- Trạng thái: pending, confirmed, cancelled, completed
- Liên kết customer & pitch

### Bảng PriceSlots
- Giá theo khung giờ (6-9AM, 9-12PM, etc)
- Liên kết với pitch

### Bảng Notifications
- Thông báo cho khách hàng
- Loại: booking, payment, system

## 👨‍💻 Tác Giả

**Võ Tấn Thịnh** - Year 4 Student at Ho Chi Minh City University of Transport
- GitHub: [@VoTanThinh12](https://github.com/VoTanThinh12)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Đóng Góp

Các pull requests được chào đón. Để thay đổi lớn, vui lòng mở issue trước để thảo luận các thay đổi bạn muốn thực hiện.

## ❓ Hỗ Trợ

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng mở issue trên GitHub.
