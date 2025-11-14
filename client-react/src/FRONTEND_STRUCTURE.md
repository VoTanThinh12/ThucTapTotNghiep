# Frontend Structure - Mini Football Management System

## Cấu Trúc Dự Án React

```
client-react/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PitchList.jsx
│   │   │   ├── PitchForm.jsx
│   │   │   ├── PitchDetail.jsx
│   │   │   ├── TimeSlotList.jsx
│   │   │   ├── TimeSlotForm.jsx
│   │   │   ├── BookingList.jsx
│   │   │   ├── BookingDetail.jsx
│   │   │   ├── CustomerList.jsx
│   │   │   ├── CustomerDetail.jsx
│   │   │   └── Statistics.jsx
│   │   └── customer/
│   │       ├── PitchBrowser.jsx
│   │       ├── PitchSearch.jsx
│   │       ├── PitchCard.jsx
│   │       ├── BookingFlow.jsx
│   │       ├── PaymentForm.jsx
│   │       ├── MyBookings.jsx
│   │       └── ReviewForm.jsx
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminPitches.jsx
│   │   ├── AdminBookings.jsx
│   │   ├── AdminCustomers.jsx
│   │   ├── CustomerHome.jsx
│   │   ├── CustomerPitches.jsx
│   │   ├── CustomerBooking.jsx
│   │   ├── CustomerProfile.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── pitchService.js
│   │   ├── bookingService.js
│   │   ├── paymentService.js
│   │   └── customerService.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── usePitches.js
│   │   └── useBookings.js
│   ├── styles/
│   │   ├── main.css
│   │   ├── admin.css
│   │   ├── customer.css
│   │   └── responsive.css
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   └── formatters.js
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## Cấu Trúc Component Chi Tiết

### Admin Dashboard
- **Dashboard.jsx** - Trang chính admin với thống kê
  - Tổng doanh thu
  - Tổng đặt phòng
  - Sân bóng được sử dụng nhiều nhất
  - Biểu đồ doanh thu theo tháng

### Quản Lý Sân Bóng (Pitches)
- **PitchList.jsx** - Danh sách tất cả sân
  - Hiển thị dạng bảng hoặc card
  - Tìm kiếm, lọc theo loại sân
  - Nút edit, delete
- **PitchForm.jsx** - Form thêm/sửa sân
  - Nhập tên, loại sân, vị trí
  - Nhập mô tả, rules
  - Chọn giờ mở cửa/đóng cửa
- **PitchDetail.jsx** - Chi tiết sân
  - Hiển thị đầy đủ thông tin
  - Quản lý time slots
  - Hiển thị đánh giá khách hàng

### Quản Lý Khung Giờ (Time Slots)
- **TimeSlotList.jsx** - Danh sách khung giờ
  - Theo sân bóng
  - Hiển thị giá, khung giờ
- **TimeSlotForm.jsx** - Thêm/sửa khung giờ
  - Chọn sân bóng
  - Nhập giờ bắt đầu/kết thúc
  - Nhập giá

### Quản Lý Đặt Lịch (Bookings)
- **BookingList.jsx** - Danh sách đặt phòng
  - Lọc theo trạng thái (pending, confirmed, completed)
  - Hiển thị info khách, sân, giá
  - Nút xác nhận, hủy
- **BookingDetail.jsx** - Chi tiết đặt phòng
  - Thông tin khách hàng
  - Sân bóng, khung giờ
  - Trạng thái thanh toán

### Quản Lý Khách Hàng (Customers)
- **CustomerList.jsx** - Danh sách khách hàng
  - Tổng tiền chi, số lần đặt
  - Trạng thái (active, banned)
- **CustomerDetail.jsx** - Chi tiết khách
  - Thông tin cá nhân
  - Lịch sử đặt phòng
  - Tổng tiền chi tiêu

### Giao Diện Khách Hàng

#### Tìm Kiếm & Duyệt Sân
- **PitchBrowser.jsx** - Trang chính khách
  - Hiển thị sân gợi ý
  - Danh sách sân hot
  - Sân theo loại (5v5, 7v7)
- **PitchSearch.jsx** - Tìm kiếm sân
  - Tìm theo vị trí, loại sân
  - Lọc theo giá
  - Sắp xếp theo đánh giá
- **PitchCard.jsx** - Card sân bóng
  - Hình ảnh sân
  - Tên, vị trị, loại sân
  - Giá từ-đến
  - Rating sao

#### Đặt Lịch
- **BookingFlow.jsx** - Quy trình đặt lịch
  - Chọn ngày
  - Chọn khung giờ
  - Xem giá
  - Xác nhận đặt
- **PaymentForm.jsx** - Form thanh toán
  - Chọn phương thức (cash, bank, VNPAY, MoMo)
  - Nhập thông tin thanh toán
  - Xác nhận thanh toán

#### Lịch Sử & Đánh Giá
- **MyBookings.jsx** - Lịch sử đặt phòng
  - Danh sách đặt phòng
  - Hiển thị trạng thái
  - Nút hủy, thanh toán
- **ReviewForm.jsx** - Form đánh giá
  - Cho sao (1-5)
  - Nhập bình luận
  - Gửi đánh giá

## Key Features

### Routing
```jsx
<Routes>
  {/* Public */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  
  {/* Admin */}
  <Route path="/admin/*" element={<AdminLayout />}>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="pitches" element={<AdminPitches />} />
    <Route path="bookings" element={<AdminBookings />} />
    <Route path="customers" element={<AdminCustomers />} />
  </Route>
  
  {/* Customer */}
  <Route path="/*" element={<CustomerLayout />}>
    <Route path="" element={<CustomerHome />} />
    <Route path="pitches" element={<CustomerPitches />} />
    <Route path="booking/:pitchId" element={<CustomerBooking />} />
    <Route path="profile" element={<CustomerProfile />} />
  </Route>
</Routes>
```

### State Management
- React Context API cho authentication
- Local state cho UI components
- Redux (optional) cho complex state

### Styling
- Bootstrap 5 cho responsive design
- Custom CSS cho styling riêng
- Tailwind CSS (optional)

## API Integration

### Service Layer
- `api.js` - Axios instance
- `authService.js` - Login, register, logout
- `pitchService.js` - CRUD pitches, time slots
- `bookingService.js` - CRUD bookings
- `paymentService.js` - Payment processing
- `customerService.js` - Customer management

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0",
    "axios": "^1.3.0",
    "bootstrap": "^5.3.0",
    "react-bootstrap": "^2.7.0",
    "react-icons": "^4.7.0",
    "moment": "^2.29.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0"
  }
}
```

## Setup Instructions

1. **Install dependencies**
```bash
npm install
```

2. **Configure API endpoint**
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Run development server**
```bash
npm start
```

4. **Build for production**
```bash
npm run build
```

## Pages Overview

### Admin Pages
- `/admin/dashboard` - Dashboard với thống kê
- `/admin/pitches` - Quản lý sân bóng
- `/admin/pitches/new` - Thêm sân
- `/admin/pitches/:id/edit` - Sửa sân
- `/admin/bookings` - Quản lý đặt lịch
- `/admin/customers` - Quản lý khách hàng

### Customer Pages
- `/` - Trang chủ
- `/pitches` - Duyệt sân bóng
- `/booking/:pitchId` - Đặt lịch
- `/profile` - Hồ sơ cá nhân
- `/my-bookings` - Lịch sử đặt phòng
- `/login` - Đăng nhập
- `/register` - Đăng ký

## Notes
- Tất cả components sử dụng functional components với React Hooks
- Responsive design cho mobile, tablet, desktop
- State management bằng Context API
- Error handling và loading states
- Form validation trước khi gửi
