-- Mini Football Management System Database Schema
-- Cơ sở dữ liệu cho hệ thống quản lý sân bóng mini

CREATE DATABASE IF NOT EXISTS mini_football_management;
USE mini_football_management;

-- ========================================
-- 1. BẢNG USERS - Tài khoản người dùng
-- ========================================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  role ENUM('admin', 'manager', 'customer') NOT NULL DEFAULT 'customer',
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 2. BẢNG PITCHES - Sân bóng
-- ========================================
CREATE TABLE pitches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  pitch_type ENUM('5v5', '7v7', '11v11') NOT NULL,
  location VARCHAR(300) NOT NULL,
  description TEXT,
  rules TEXT,
  open_time TIME DEFAULT '06:00:00',
  close_time TIME DEFAULT '23:00:00',
  max_capacity INT,
  is_available TINYINT DEFAULT 1,
  image_url VARCHAR(500),
  rating DECIMAL(3,1) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_pitch_type (pitch_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 3. BẢNG TIME_SLOTS - Khung giờ hoạt động
-- ========================================
CREATE TABLE time_slots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pitch_id INT NOT NULL,
  slot_name VARCHAR(50) NOT NULL COMMENT '06:00-09:00, 09:00-12:00, etc',
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  is_available TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE,
  UNIQUE KEY unique_pitch_slot (pitch_id, start_time, end_time),
  INDEX idx_pitch_id (pitch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 4. BẢNG CUSTOMERS - Thông tin khách hàng
-- ========================================
CREATE TABLE customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  address TEXT,
  total_spent DECIMAL(15,2) DEFAULT 0,
  total_bookings INT DEFAULT 0,
  loyalty_points INT DEFAULT 0,
  status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 5. BẢNG BOOKINGS - Đặt lịch sân
-- ========================================
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pitch_id INT NOT NULL,
  customer_id INT NOT NULL,
  booking_date DATE NOT NULL,
  time_slot_id INT NOT NULL,
  duration INT COMMENT 'Duration in minutes',
  total_price DECIMAL(15,2) NOT NULL,
  deposit_paid DECIMAL(15,2) DEFAULT 0,
  remaining_payment DECIMAL(15,2) NOT NULL,
  payment_status ENUM('unpaid', 'partial', 'paid') DEFAULT 'unpaid',
  booking_status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  team_a_name VARCHAR(100),
  team_b_name VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE RESTRICT,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
  FOREIGN KEY (time_slot_id) REFERENCES time_slots(id) ON DELETE RESTRICT,
  INDEX idx_pitch_id (pitch_id),
  INDEX idx_customer_id (customer_id),
  INDEX idx_booking_date (booking_date),
  INDEX idx_booking_status (booking_status),
  INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 6. BẢNG PAYMENTS - Thanh toán
-- ========================================
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_method ENUM('cash', 'bank_transfer', 'vnpay', 'momo') DEFAULT 'cash',
  transaction_id VARCHAR(100),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_booking_id (booking_id),
  INDEX idx_payment_status (payment_status),
  INDEX idx_payment_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 7. BẢNG REVIEWS - Đánh giá sân bóng
-- ========================================
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pitch_id INT NOT NULL,
  customer_id INT NOT NULL,
  booking_id INT,
  rating INT NOT NULL COMMENT '1-5 stars',
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  INDEX idx_pitch_id (pitch_id),
  INDEX idx_customer_id (customer_id),
  INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 8. BẢNG NOTIFICATIONS - Thông báo
-- ========================================
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('booking', 'payment', 'system', 'reminder') DEFAULT 'system',
  related_booking_id INT,
  is_read TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (related_booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 9. BẢNG STATISTICS - Thống kê
-- ========================================
CREATE TABLE statistics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pitch_id INT,
  stat_date DATE NOT NULL,
  total_bookings INT DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  occupancy_rate DECIMAL(5,2) DEFAULT 0,
  avg_rating DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE,
  UNIQUE KEY unique_pitch_date (pitch_id, stat_date),
  INDEX idx_stat_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- SAMPLE DATA
-- ========================================

-- Insert Users
INSERT INTO users (username, password_hash, full_name, email, role) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq', 'Quản trị viên', 'admin@minifootball.com', 'admin'),
('manager1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq', 'Người quản lý 1', 'manager1@minifootball.com', 'manager'),
('customer1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq', 'Nguyễn Văn A', 'customer1@gmail.com', 'customer'),
('customer2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq', 'Trần Thị B', 'customer2@gmail.com', 'customer');

-- Insert Pitches
INSERT INTO pitches (name, pitch_type, location, description, rules, open_time, close_time, max_capacity, image_url) VALUES
('Sân Bóng Khang An', '7v7', '18A Phan Văn Trị, Phường 10, Gò Vấp, TP.HCM', 'Sân có nhân tạo chất lượng cao, có công tắc và bãi giữ xe rộng rãi', 'Vui lòng tắc các trụ trước 50 cho các giải cao ơm', '06:00:00', '23:00:00', 14, NULL),
('Sân Bóng Chợ Hoa', '5v5', '256 Hồ Hàng, Phường 13, Quận 10, TP.HCM', 'Sân tạo chuẩn, một cỏ mầm, hệ thống đèn chiếu sáng tốt', 'Gìn gìn vệ sinh chung. Khách hàng tự bảo quản tài sản cá nhân', '06:00:00', '23:00:00', 10, NULL),
('Sân Bóng Phở Thờ', '7v7', '219 Lý Thường Kiệt, Phường 15, Quận 11, TP.HCM', 'Nằm trong khu liên hợp thể thao Phở Thờ, sân rộng và chuyên nghiệp', 'Tuân thủ các quy nnh của ban quản lý khu liên hợp', '05:00:00', '23:00:00', 14, NULL),
('Sân Bóng Tạo Đàn', '5v5', '1 Huyền Trân Công Chúa, Bến Thành, Quận 1, TP.HCM', 'Vị trí trung tâm, một cỏ mầm có thay thế', 'Chủ nhân tự sân trước. Không hút thuốc trong khuôn viên sân', '06:00:00', '22:00:00', 10, NULL);

-- Insert Time Slots for Pitch 1
INSERT INTO time_slots (pitch_id, slot_name, start_time, end_time, price) VALUES
(1, '06:00-09:00', '06:00:00', '09:00:00', 350000),
(1, '09:00-12:00', '09:00:00', '12:00:00', 400000),
(1, '12:00-15:00', '12:00:00', '15:00:00', 450000),
(1, '15:00-18:00', '15:00:00', '18:00:00', 550000),
(1, '18:00-23:00', '18:00:00', '23:00:00', 700000);

-- Insert Customers
INSERT INTO customers (user_id, full_name, phone, email, address) VALUES
(3, 'Nguyễn Văn A', '0901234567', 'customer1@gmail.com', '123 Đường ABC, Quận 1'),
(4, 'Trần Thị B', '0912345678', 'customer2@gmail.com', '456 Đường DEF, Quận 2');
