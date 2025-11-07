-- Database: mini_football
CREATE DATABASE IF NOT EXISTS mini_football CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mini_football;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Pitches
CREATE TABLE IF NOT EXISTS pitches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('5v5','7v7') NOT NULL,
  location VARCHAR(100) NOT NULL,
  description TEXT,
  price_hour INT NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  pitch_id INT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price INT NOT NULL,
  status ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_pitch FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed admin (change password later)
INSERT INTO users (username, password_hash, full_name, role)
VALUES ('admin', '$2a$10$0A8k0m5bqZQyQ0m0bV9GpeT2a8D7e1t2KqHkJgQ6j5cH6a8b9cDeW', 'Administrator', 'admin')
ON DUPLICATE KEY UPDATE username=username;
-- Password hash corresponds to: Admin@123 (change in production)
