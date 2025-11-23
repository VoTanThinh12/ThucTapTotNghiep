# 🏟️ HỆ THỐNG QUẢN LÝ SÂN BÓNG MINI

Website quản lý và đặt sân bóng mini trực tuyến, xây dựng bằng ReactJS (Frontend) và Node.js (Backend)

## 📋 Thông tin dự án

- **Tên dự án**: Mini Soccer Website
- **Công nghệ**: React + Node.js + MySQL
- **Mục đích**: Đồ án tốt nghiệp
- **Sinh viên**: Võ Tấn Thịnh - 2251120252

## ✨ Tính năng chính

### 🎯 Trang Khách hàng
- ✅ Xem danh sách sân bóng có sẵn
- ✅ Tìm kiếm & lọc sân theo loại, địa điểm, giá, giờ
- ✅ Xem chi tiết sân (ảnh, mô tả, tiện ích, đánh giá)
- ✅ Đặt sân trực tuyến (chọn ngày, giờ, dịch vụ bổ sung)
- ✅ Quản lý đơn đặt sân cá nhân
- ✅ Xem lịch sử đặt sân và thanh toán
- ✅ Đánh giá và review sau khi sử dụng

### 👨‍💼 Trang Quản trị
- ✅ Dashboard tổng quan (thống kê nhanh)
- ✅ Quản lý sân bóng (CRUD)
- ✅ Quản lý khung giờ và giá
- ✅ Quản lý đơn đặt sân (xác nhận, hủy, hoàn tiền)
- ✅ Quản lý khách hàng
- ✅ Quản lý dịch vụ bổ sung
- ✅ Báo cáo doanh thu chi tiết
- ✅ Báo cáo hiệu suất sân (tỉ lệ sử dụng)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **React Router v6** - Routing
- **Axios** - HTTP Client
- **Bootstrap 5** - CSS Framework
- **React Toastify** - Notifications
- **React Hook Form** - Form handling
- **HeroIcons** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MySQL2** - Database Driver
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Multer** - File Upload
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Environment Variables

### Database
- **MySQL 8.0+** - Relational Database

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 16+
- MySQL 8.0+
- npm hoặc yarn

### 1. Clone repository
```bash
git clone https://github.com/yourusername/mini-soccer-website.git
cd mini-soccer-website
```

### 2. Cài đặt Backend
```bash
cd server
npm install
```

Tạo file `.env` trong thư mục `server`:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mini_soccer_db
DB_PORT=3306

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

Tạo database:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

Chạy server:
```bash
npm run dev
```

### 3. Cài đặt Frontend
```bash
cd client
npm install
```

Tạo file `.env` trong thư mục `client`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_UPLOAD_URL=http://localhost:5000/uploads
```

Chạy React app:
```bash
npm start
```

## 🚀 Sử dụng

### Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

### Tài khoản mặc định

**Admin:**
- Email: `admin@soccerhub.com`
- Password: `123456`

**Customer:**
- Email: `nguyenvana@example.com`
- Password: `123456`

## 📁 Cấu trúc thư mục

```
mini-soccer-website/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # Context API
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utilities
│   └── package.json
│
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── models/         # Database models
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Middlewares
│   │   └── utils/          # Utilities
│   ├── uploads/            # Uploaded files
│   └── package.json
│
└── database/               # Database scripts
    ├── schema.sql
    └── seed.sql
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user

### Pitches
- `GET /api/pitches` - Lấy danh sách sân
- `GET /api/pitches/:id` - Lấy chi tiết sân
- `POST /api/pitches` - Tạo sân mới (Admin)
- `PUT /api/pitches/:id` - Cập nhật sân (Admin)
- `DELETE /api/pitches/:id` - Xóa sân (Admin)

### Bookings
- `GET /api/bookings` - Lấy danh sách đơn đặt
- `GET /api/bookings/:id` - Lấy chi tiết đơn đặt
- `POST /api/bookings` - Tạo đơn đặt mới
- `PUT /api/bookings/:id` - Cập nhật đơn đặt
- `DELETE /api/bookings/:id` - Hủy đơn đặt

### Services
- `GET /api/services` - Lấy danh sách dịch vụ
- `POST /api/services` - Tạo dịch vụ (Admin)

### Reports
- `GET /api/reports/revenue` - Báo cáo doanh thu
- `GET /api/reports/pitches` - Báo cáo sử dụng sân

## 🧪 Testing

### Backend
```bash
cd server
npm test
```

### Frontend
```bash
cd client
npm test
```

## 📈 Tiến độ phát triển

- [x] Phân tích & Thiết kế (100%)
- [x] Database Schema (100%)
- [ ] Backend API (40%)
  - [x] Authentication
  - [ ] Pitch Management
  - [ ] Booking System
  - [ ] Payment Integration
- [ ] Frontend (30%)
  - [x] Authentication Pages
  - [ ] Customer Pages
  - [ ] Admin Dashboard

## 🤝 Đóng góp

Project này là đồ án tốt nghiệp cá nhân. Mọi góp ý và feedback xin gửi qua email.

## 📞 Liên hệ

- **Sinh viên**: Võ Tấn Thịnh
- **MSSV**: 2251120252
- **Email**: votanthinh@example.com
- **GitHub**: https://github.com/VoTanThinh12

## 📄 License

MIT License - Đồ án học tập

---

**© 2025 SoccerHub - Hệ thống Quản lý Sân Bóng Mini**
