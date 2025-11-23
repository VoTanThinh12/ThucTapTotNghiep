# 🚀 HƯỚNG DẪN CÀI ĐẶT NHANH

## 📋 Danh sách file cần tạo thêm

### Frontend (client/)
```
client/
├── public/
│   └── index.html          ← Tạo file này
├── src/
│   ├── styles/
│   │   └── main.css        ← Tạo file này
│   └── .env                ← Tạo file này
```

### Backend (server/)
```
server/
├── uploads/                ← Tạo thư mục trống
├── .env                    ← Tạo từ .env.example
```

## 🛠️ Các bước cài đặt

### 1. Tạo thư mục uploads (Backend)

```bash
cd server
mkdir uploads
```

### 2. Tạo file .env cho Backend

```bash
cd server
cp .env.example .env
```

Sau đó mở file `.env` và điền thông tin:
```env
PORT=5000
DB_PASSWORD=your_mysql_password_here
JWT_SECRET=your_random_secret_key_here
```

### 3. Tạo file .env cho Frontend

```bash
cd client
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
echo "REACT_APP_UPLOAD_URL=http://localhost:5000/uploads" >> .env
```

### 4. Cài đặt dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 5. Setup Database

```bash
# Đăng nhập MySQL
mysql -u root -p

# Tạo database
CREATE DATABASE mini_soccer_db;
exit;

# Import schema và data
mysql -u root -p mini_soccer_db < database/schema.sql
mysql -u root -p mini_soccer_db < database/seed.sql
```

### 6. Chạy project

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## ✅ Kiểm tra

- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:3000
- Login: admin@soccerhub.com / 123456

## 🎯 Hoàn tất!

Bạn đã sẵn sàng để phát triển! 🚀
