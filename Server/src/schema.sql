-- Database: mini_football
CREATE DATABASE IF NOT EXISTS mini_football CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mini_football;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role ENUM('admin','customer') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20) NOT NULL,
  total_spent DECIMAL(15,2) DEFAULT 0,
  booking_count INT DEFAULT 0,
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Pitches Table
CREATE TABLE IF NOT EXISTS pitches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('5v5','7v7') NOT NULL,
  location VARCHAR(200) NOT NULL,
  description TEXT,
  rules TEXT,
  open_time TIME NOT NULL DEFAULT '06:00:00',
  close_time TIME NOT NULL DEFAULT '23:00:00',
  images JSON,
  min_price DECIMAL(10,2) DEFAULT 0,
  max_price DECIMAL(10,2) DEFAULT 0,
  status ENUM('active','inactive') DEFAULT 'active',
  rating DECIMAL(2,1) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Price Slots Table
CREATE TABLE IF NOT EXISTS price_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pitch_id INT NOT NULL,
  time_slot VARCHAR(20) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE,
  UNIQUE KEY unique_pitch_slot (pitch_id, time_slot)
) ENGINE=InnoDB;

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pitch_id INT NOT NULL,
  customer_id INT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration DECIMAL(3,1) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  deposit_paid BOOLEAN DEFAULT FALSE,
  status ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  message TEXT NOT NULL,
  type ENUM('booking','payment','system') DEFAULT 'system',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed Data
INSERT INTO users (username, password_hash, full_name, role)
VALUES ('admin', '$2a$10$0A8k0m5bqZQyQ0m0bV9GpeT2a8D7e1t2KqHkJgQ6j5cH6a8b9cDeW', 'Administrator', 'admin')
ON DUPLICATE KEY UPDATE username=username;
-- Password: Admin@123

-- Sample Pitches
INSERT INTO pitches (name, type, location, description, rules, open_time, close_time, images, min_price, max_price)
VALUES 
('Sân Bóng Số 1', '5v5', 'Quận 1, TP.HCM', 'Sân cỏ nhân tạo chất lượng cao', 'Không hút thuốc. Mang giày đúng quy định.', '06:00:00', '23:00:00', '[]', 200000, 400000),
('Sân Bóng Số 2', '7v7', 'Quận 3, TP.HCM', 'Sân rộng rãi, có mái che', 'Không uống rượu bia trong sân.', '06:00:00', '23:00:00', '[]', 300000, 600000)
ON DUPLICATE KEY UPDATE name=name;

-- Sample Price Slots
INSERT INTO price_slots (pitch_id, time_slot, price)
VALUES 
(1, '06-09', 200000),
(1, '09-12', 250000),
(1, '12-15', 300000),
(1, '15-18', 350000),
(1, '18-23', 400000),
(2, '06-09', 300000),
(2, '09-12', 350000),
(2, '12-15', 400000),
(2, '15-18', 500000),
(2, '18-23', 600000)
ON DUPLICATE KEY UPDATE price=price;
