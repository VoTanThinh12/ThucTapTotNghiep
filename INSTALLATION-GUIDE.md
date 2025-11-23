# 🚀 HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY PROJECT

## 📋 Yêu cầu hệ thống

- **Node.js**: 16.x trở lên
- **MySQL**: 8.0 trở lên
- **npm** hoặc **yarn**
- **Git**

## 📦 Các bước cài đặt

### Bước 1: Clone hoặc tải project

```bash
# Clone từ GitHub (nếu có)
git clone https://github.com/yourusername/mini-soccer-website.git
cd mini-soccer-website

# Hoặc giải nén file zip đã tải về
unzip mini-soccer-website.zip
cd mini-soccer-website
```

### Bước 2: Cài đặt MySQL và tạo Database

1. **Cài đặt MySQL** (nếu chưa có):
   - Windows: Tải từ https://dev.mysql.com/downloads/mysql/
   - Mac: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server`

2. **Khởi động MySQL**:
   ```bash
   # Windows: Khởi động MySQL Service từ Services
   # Mac/Linux:
   sudo service mysql start
   # hoặc
   mysql.server start
   ```

3. **Tạo Database**:
   ```bash
   # Đăng nhập MySQL
   mysql -u root -p
   
   # Nhập password MySQL của bạn
   # Sau đó chạy lệnh tạo database:
   CREATE DATABASE mini_soccer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   exit;
   ```

4. **Import Schema và Seed Data**:
   ```bash
   # Trong thư mục gốc project
   mysql -u root -p mini_soccer_db < database/schema.sql
   mysql -u root -p mini_soccer_db < database/seed.sql
   ```

### Bước 3: Cài đặt Backend (Server)

```bash
# Di chuyển vào thư mục server
cd server

# Cài đặt dependencies
npm install

# Tạo file .env từ file mẫu
cp .env.example .env

# Mở file .env và cập nhật thông tin:
# - DB_PASSWORD: Mật khẩu MySQL của bạn
# - JWT_SECRET: Thay bằng chuỗi bí mật của bạn
nano .env  # hoặc code .env (VS Code)
```

**File .env cần điền:**
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE  # <-- Thay đổi
DB_NAME=mini_soccer_db
DB_PORT=3306

JWT_SECRET=your_super_secret_jwt_key_change_this  # <-- Thay đổi
JWT_EXPIRE=7d

UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

CLIENT_URL=http://localhost:3000
```

**Tạo thư mục uploads:**
```bash
mkdir uploads
```

**Chạy Backend Server:**
```bash
# Development mode (auto-restart khi có thay đổi)
npm run dev

# Production mode
npm start
```

✅ Server sẽ chạy tại: **http://localhost:5000**

### Bước 4: Cài đặt Frontend (Client)

**Mở terminal/cmd mới** (giữ terminal backend đang chạy):

```bash
# Di chuyển vào thư mục client
cd client

# Cài đặt dependencies
npm install

# Tạo file .env
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
echo "REACT_APP_UPLOAD_URL=http://localhost:5000/uploads" >> .env

# Hoặc tạo file .env thủ công với nội dung:
# REACT_APP_API_URL=http://localhost:5000/api
# REACT_APP_UPLOAD_URL=http://localhost:5000/uploads

# Chạy React App
npm start
```

✅ Frontend sẽ tự động mở tại: **http://localhost:3000**

## 🎯 Kiểm tra cài đặt

### Test Backend API:
```bash
# Test Health Check
curl http://localhost:5000/api/health

# Response: {"status":"OK","timestamp":"..."}
```

### Test Database:
```bash
# Kiểm tra kết nối database
mysql -u root -p mini_soccer_db -e "SHOW TABLES;"

# Kết quả phải hiển thị các bảng: users, pitches, bookings, ...
```

## 🔐 Tài khoản mặc định

### Admin:
- **Email**: `admin@soccerhub.com`
- **Password**: `123456`

### Customer:
- **Email**: `nguyenvana@example.com`
- **Password**: `123456`

## 📁 Cấu trúc thư mục hoàn chỉnh

```
mini-soccer-website/
├── client/                    # Frontend ReactJS
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── .env
│   └── package.json
│
├── server/                    # Backend Node.js
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── app.js
│   ├── uploads/
│   ├── .env
│   └── package.json
│
├── database/                  # SQL Scripts
│   ├── schema.sql
│   └── seed.sql
│
└── README.md
```

## 🐛 Xử lý lỗi thường gặp

### Lỗi: "Cannot connect to MySQL"
```bash
# Kiểm tra MySQL đang chạy
sudo service mysql status

# Khởi động MySQL nếu chưa chạy
sudo service mysql start

# Kiểm tra thông tin đăng nhập
mysql -u root -p
```

### Lỗi: "Port 3000 already in use"
```bash
# Tìm và kill process đang dùng port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Lỗi: "Module not found"
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "CORS policy"
```bash
# Kiểm tra file .env trong server
# CLIENT_URL phải khớp với URL frontend
CLIENT_URL=http://localhost:3000
```

## 📝 Lệnh hữu ích

```bash
# Backend
cd server
npm run dev          # Chạy development mode
npm start            # Chạy production mode
npm test             # Chạy tests

# Frontend
cd client
npm start            # Chạy development mode
npm run build        # Build production
npm test             # Chạy tests

# Database
mysql -u root -p mini_soccer_db < database/schema.sql    # Reset database
mysql -u root -p mini_soccer_db < database/seed.sql      # Load sample data
```

## 🎓 Các bước tiếp theo

1. ✅ Cài đặt và chạy thành công
2. 📖 Đọc file API Documentation
3. 💻 Bắt đầu phát triển tính năng
4. 🧪 Viết tests
5. 🚀 Deploy lên server

## 🆘 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra lại các bước cài đặt
2. Xem phần "Xử lý lỗi thường gặp"
3. Tạo issue trên GitHub
4. Liên hệ: votanthinh@example.com

---

**Chúc bạn phát triển project thành công! 🎉**
