-- ================================================================
-- SCHEMA DATABASE - HỆ THỐNG QUẢN LÝ SÂN BÓNG MINI
-- ================================================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS mini_soccer_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE mini_soccer_db;

-- ================================================================
-- 1. BẢNG USERS (Người dùng)
-- ================================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    avatar VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 2. BẢNG PITCHES (Sân bóng)
-- ================================================================
CREATE TABLE pitches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('5v5', '7v7', '11v11') NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    capacity INT NOT NULL,
    price_per_hour DECIMAL(10, 2) NOT NULL,
    images JSON, -- Mảng URL ảnh: ["url1", "url2"]
    facilities JSON, -- Danh sách tiện ích: ["Bãi đỗ xe", "Nhà vệ sinh", "Quán nước"]
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_location (location),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 3. BẢNG TIMESLOTS (Khung giờ & Tính khả dụng)
-- ================================================================
CREATE TABLE timeslots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pitch_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE,
    UNIQUE KEY unique_timeslot (pitch_id, date, start_time),
    INDEX idx_date (date),
    INDEX idx_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 4. BẢNG SERVICES (Dịch vụ bổ sung)
-- ================================================================
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50), -- "sân", "lần", "cái"
    category ENUM('equipment', 'beverage', 'other') DEFAULT 'other',
    status ENUM('active', 'inactive') DEFAULT 'active',
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 5. BẢNG BOOKINGS (Đơn đặt sân)
-- ================================================================
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    pitch_id INT NOT NULL,
    timeslot_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2) DEFAULT 0,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    customer_email VARCHAR(100),
    notes TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE,
    FOREIGN KEY (timeslot_id) REFERENCES timeslots(id) ON DELETE CASCADE,
    INDEX idx_booking_code (booking_code),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_booking_date (booking_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 6. BẢNG BOOKING_SERVICES (Quan hệ Đơn đặt - Dịch vụ)
-- ================================================================
CREATE TABLE booking_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    service_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 7. BẢNG PAYMENTS (Thanh toán)
-- ================================================================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_method ENUM('cash', 'transfer', 'momo', 'vnpay') DEFAULT 'cash',
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(100),
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    notes TEXT,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 8. BẢNG REVIEWS (Đánh giá)
-- ================================================================
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    pitch_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE,
    INDEX idx_pitch_id (pitch_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 9. VIEW - BOOKING DETAILS (Chi tiết đơn đặt đầy đủ)
-- ================================================================
CREATE VIEW v_booking_details AS
SELECT 
    b.id,
    b.booking_code,
    b.booking_date,
    b.start_time,
    b.end_time,
    b.total_price,
    b.deposit_amount,
    b.status,
    b.customer_name,
    b.customer_phone,
    u.full_name AS user_name,
    u.email AS user_email,
    p.name AS pitch_name,
    p.type AS pitch_type,
    p.location AS pitch_location,
    py.payment_method,
    py.status AS payment_status
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN pitches p ON b.pitch_id = p.id
LEFT JOIN payments py ON b.id = py.booking_id;

-- ================================================================
-- 10. STORED PROCEDURE - Kiểm tra khả dụng
-- ================================================================
DELIMITER $$

CREATE PROCEDURE CheckAvailability(
    IN p_pitch_id INT,
    IN p_date DATE,
    IN p_start_time TIME,
    IN p_end_time TIME
)
BEGIN
    SELECT 
        COUNT(*) AS conflict_count
    FROM timeslots
    WHERE pitch_id = p_pitch_id
        AND date = p_date
        AND is_available = TRUE
        AND (
            (start_time >= p_start_time AND start_time < p_end_time)
            OR (end_time > p_start_time AND end_time <= p_end_time)
            OR (start_time <= p_start_time AND end_time >= p_end_time)
        );
END$$

DELIMITER ;

-- ================================================================
-- HOÀN TẤT SCHEMA
-- ================================================================
