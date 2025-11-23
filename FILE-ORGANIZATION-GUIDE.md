# 📦 HƯỚNG DẪN SẮP XẾP FILE CODE

## 🗂️ Cấu trúc thư mục hoàn chỉnh

```
mini-soccer-website/
│
├── server/                              # BACKEND
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js              ← server-config-database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js        ← authController.js
│   │   │   ├── pitchController.js       ← pitchController.js
│   │   │   ├── bookingController.js     ← bookingController.js
│   │   │   └── serviceController.js     ← serviceController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js            ← authRoutes.js
│   │   │   ├── pitchRoutes.js           ← pitchRoutes.js
│   │   │   ├── bookingRoutes.js         ← bookingRoutes.js
│   │   │   ├── serviceRoutes.js         ← serviceRoutes.js
│   │   │   └── userRoutes.js            ← userRoutes.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.js                  ← server-middleware-auth.js
│   │   │   └── errorHandler.js          ← server-middleware-errorHandler.js
│   │   │
│   │   └── app.js                       ← server-app.js
│   │
│   ├── uploads/                         (tạo thư mục trống)
│   ├── .env                             ← server-env-example.env (đổi tên)
│   └── package.json                     ← server-package.json
│
├── client/                              # FRONTEND
│   ├── public/
│   │   └── index.html                   (tạo file HTML cơ bản)
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx           ← react-Header.jsx
│   │   │   │   └── Footer.jsx           ← react-Footer.jsx
│   │   │   │
│   │   │   └── pitch/
│   │   │       └── PitchCard.jsx        ← react-PitchCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── client/
│   │   │   │   └── HomePage.jsx         ← react-HomePage.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   └── LoginPage.jsx        ← react-LoginPage.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       └── AdminDashboard.jsx   ← react-AdminDashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js                   ← react-api-service.js
│   │   │
│   │   ├── styles/
│   │   │   └── main.css                 (tạo file CSS trống)
│   │   │
│   │   ├── App.jsx                      ← react-App.jsx
│   │   └── index.js                     ← react-index.js
│   │
│   ├── .env                             (tạo file .env)
│   └── package.json                     ← client-package.json
│
├── database/                            # DATABASE
│   ├── schema.sql                       ← database-schema.sql
│   └── seed.sql                         ← database-seed.sql
│
├── README.md                            ← README.md
├── INSTALLATION-GUIDE.md                ← INSTALLATION-GUIDE.md
└── project-structure.md                 ← project-structure.md
```

## 📝 Các bước thực hiện

### 1. Tạo cấu trúc thư mục

```bash
# Tạo thư mục gốc
mkdir mini-soccer-website
cd mini-soccer-website

# Tạo cấu trúc server
mkdir -p server/src/{config,controllers,routes,middlewares,utils}
mkdir server/uploads

# Tạo cấu trúc client
mkdir -p client/src/{components/{common,pitch},pages/{client,auth,admin},services,styles}
mkdir client/public
```

### 2. Copy files vào đúng vị trí

**Backend files:**
```bash
# Config
cp server-config-database.js server/src/config/database.js

# Controllers
cp authController.js server/src/controllers/
cp pitchController.js server/src/controllers/
cp bookingController.js server/src/controllers/
cp serviceController.js server/src/controllers/

# Routes
cp authRoutes.js server/src/routes/
cp pitchRoutes.js server/src/routes/
cp bookingRoutes.js server/src/routes/
cp serviceRoutes.js server/src/routes/
cp userRoutes.js server/src/routes/

# Middlewares
cp server-middleware-auth.js server/src/middlewares/auth.js
cp server-middleware-errorHandler.js server/src/middlewares/errorHandler.js

# Main app
cp server-app.js server/src/app.js

# Config files
cp server-package.json server/package.json
cp server-env-example.env server/.env
```

**Frontend files:**
```bash
# Components
cp react-Header.jsx client/src/components/common/Header.jsx
cp react-Footer.jsx client/src/components/common/Footer.jsx
cp react-PitchCard.jsx client/src/components/pitch/PitchCard.jsx

# Pages
cp react-HomePage.jsx client/src/pages/client/HomePage.jsx
cp react-LoginPage.jsx client/src/pages/auth/LoginPage.jsx
cp react-AdminDashboard.jsx client/src/pages/admin/AdminDashboard.jsx

# Services
cp react-api-service.js client/src/services/api.js

# Main files
cp react-App.jsx client/src/App.jsx
cp react-index.js client/src/index.js

# Config files
cp client-package.json client/package.json
```

**Database files:**
```bash
mkdir database
cp database-schema.sql database/schema.sql
cp database-seed.sql database/seed.sql
```

### 3. Tạo các file còn thiếu

**client/public/index.html:**
```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SoccerHub - Đặt sân bóng mini</title>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>
```

**client/src/styles/main.css:**
```css
/* Custom styles */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.min-vh-100 {
  min-height: 100vh;
}
```

**client/.env:**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_UPLOAD_URL=http://localhost:5000/uploads
```

**server/.env:**
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=mini_soccer_db
DB_PORT=3306
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
CLIENT_URL=http://localhost:3000
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

### 5. Setup database

```bash
# Import schema
mysql -u root -p mini_soccer_db < database/schema.sql

# Import sample data
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

## 🎯 Kết quả

Sau khi hoàn thành, bạn sẽ có:
✅ Backend API hoàn chỉnh với authentication
✅ Frontend React với routing
✅ Admin Dashboard
✅ Trang đăng nhập/đăng ký
✅ Database với sample data

## 📞 Cần hỗ trợ?

Nếu gặp lỗi, kiểm tra:
1. MySQL đã chạy chưa?
2. Port 3000 và 5000 có bị chiếm không?
3. File .env đã cấu hình đúng chưa?
4. Dependencies đã install đầy đủ chưa?
