# Mini Football Pitch Management System - Implementation Guide

## Table of Contents
1. [Backend Setup](#backend-setup)
2. [Database Configuration](#database-configuration)
3. [API Routes Implementation](#api-routes-implementation)
4. [Frontend Setup](#frontend-setup)
5. [Authentication & Authorization](#authentication--authorization)
6. [Deployment](#deployment)

---

## Backend Setup

### Installation & Dependencies

```bash
cd Server
npm install
```

### Required Packages (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "dotenv": "^16.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "express-validator": "^7.0.0",
    "axios": "^1.4.0"
  }
}
```

### Environment Configuration (.env)

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mini_football_management
DB_PORT=3306

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

PORT=5000
NODE_ENV=development

VNPAY_TMN_CODE=your_vnpay_code
VNPAY_HASH_SECRET=your_vnpay_secret

MOMO_PARTNER_CODE=your_momo_code
MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret_key
```

---

## Database Configuration

### Connection Setup (Server/src/config/database.js)

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

### Initialize Database

```bash
mysql -u root < Server/schema.sql
```

---

## API Routes Implementation

### Project Structure

```
Server/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── pitchController.js
│   │   ├── bookingController.js
│   │   ├── paymentController.js
│   │   ├── customerController.js
│   │   ├── reviewController.js
│   │   └── statisticController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── pitchRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── statisticRoutes.js
│   └── app.js
├── package.json
└── server.js
```

### Main Application (Server/server.js)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const pitchRoutes = require('./src/routes/pitchRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const statisticRoutes = require('./src/routes/statisticRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pitches', pitchRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/statistics', statisticRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Authentication Middleware (Server/src/middleware/auth.js)

```javascript
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRole };
```

### Pitch Controller Example (Server/src/controllers/pitchController.js)

```javascript
const pool = require('../config/database');

const getAllPitches = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pitches WHERE is_active = 1');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPitchById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM pitches WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pitch not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPitch = async (req, res) => {
  try {
    const { name, type, location, description, open_time, close_time } = req.body;
    const [result] = await pool.query(
      'INSERT INTO pitches (name, type, location, description, open_time, close_time) VALUES (?, ?, ?, ?, ?, ?)',
      [name, type, location, description, open_time, close_time]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePitch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, location, description, open_time, close_time } = req.body;
    await pool.query(
      'UPDATE pitches SET name = ?, type = ?, location = ?, description = ?, open_time = ?, close_time = ? WHERE id = ?',
      [name, type, location, description, open_time, close_time, id]
    );
    res.json({ message: 'Pitch updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePitch = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE pitches SET is_active = 0 WHERE id = ?', [id]);
    res.json({ message: 'Pitch deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllPitches, getPitchById, createPitch, updatePitch, deletePitch };
```

### Pitch Routes (Server/src/routes/pitchRoutes.js)

```javascript
const express = require('express');
const { verifyToken, authorizeRole } = require('../middleware/auth');
const {
  getAllPitches,
  getPitchById,
  createPitch,
  updatePitch,
  deletePitch
} = require('../controllers/pitchController');

const router = express.Router();

router.get('/', getAllPitches);
router.get('/:id', getPitchById);
router.post('/', verifyToken, authorizeRole('admin', 'manager'), createPitch);
router.put('/:id', verifyToken, authorizeRole('admin', 'manager'), updatePitch);
router.delete('/:id', verifyToken, authorizeRole('admin'), deletePitch);

module.exports = router;
```

---

## Frontend Setup

### React Project Installation

```bash
cd client-react
npm install
npm install bootstrap react-bootstrap axios react-router-dom
```

### Key Component Structure

#### API Service (client-react/src/services/api.js)

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

#### Authentication Service (client-react/src/services/authService.js)

```javascript
import api from './api';

const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = { login, logout, getCurrentUser };
export default authService;
```

---

## Authentication & Authorization

### JWT Implementation

- Token expires after 7 days
- Refresh token mechanism for long sessions
- Role-based access control (admin, manager, customer)
- Secure token storage in localStorage

---

## Deployment

### Backend Deployment (Heroku/Railway)

```bash
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)

```bash
npm run build
# Deploy build folder
```

---

## Common API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Pitches
- `GET /api/pitches` - Get all pitches
- `GET /api/pitches/:id` - Get pitch details
- `POST /api/pitches` - Create pitch (Admin/Manager)
- `PUT /api/pitches/:id` - Update pitch (Admin/Manager)
- `DELETE /api/pitches/:id` - Delete pitch (Admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking status

### Payments
- `POST /api/payments/vnpay` - Process VNPAY payment
- `POST /api/payments/momo` - Process MoMo payment
- `GET /api/payments/:id` - Get payment status

---

## Testing Workflow

1. Start backend: `node Server/server.js`
2. Start frontend: `npm start` (in client-react)
3. Test API endpoints with Postman
4. Verify JWT authentication
5. Test CRUD operations for each resource
