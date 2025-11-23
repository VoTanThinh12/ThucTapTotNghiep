-- ================================================================
-- DỮ LIỆU MẪU (SEED DATA) - HỆ THỐNG QUẢN LÝ SÂN BÓNG MINI
-- ================================================================

USE mini_soccer_db;

-- ================================================================
-- 1. USERS - Dữ liệu người dùng mẫu
-- ================================================================
-- Mật khẩu mặc định: "123456" (đã hash bằng bcrypt)
INSERT INTO users (full_name, email, password, phone, address, role, is_active) VALUES
('Admin User', 'admin@soccerhub.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '0901234567', '123 Đường Lê Lợi, Quận 1, TP HCM', 'admin', TRUE),
('Nguyễn Văn A', 'nguyenvana@example.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '0912345678', '123 Đường Lê Lợi, Quận 1, TP HCM', 'customer', TRUE),
('Trần Thị B', 'tranthib@example.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '0923456789', '456 Đường Nguyễn Huệ, Quận 3, TP HCM', 'customer', TRUE),
('Lê Văn C', 'levanc@example.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '0934567890', '789 Đường Pasteur, Quận 3, TP HCM', 'customer', TRUE),
('Phạm Văn D', 'phamvand@example.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '0945678901', '321 Đường Cách Mạng Tháng 8, Quận 10, TP HCM', 'customer', TRUE),
('Hoàng Thị E', 'hoangthie@example.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '0956789012', '654 Đường 3 Tháng 2, Quận 10, TP HCM', 'customer', TRUE);

-- ================================================================
-- 2. PITCHES - Dữ liệu sân bóng mẫu
-- ================================================================
INSERT INTO pitches (name, type, location, address, description, capacity, price_per_hour, images, facilities, status) VALUES
(
    'Sân bóng Thể Vinh',
    '5v5',
    'Quận 1, TP HCM',
    '123 Đường Lê Lợi, Quận 1, TP HCM',
    'Sân bóng mini chất lượng cao, được bảo dưỡng thường xuyên',
    10,
    150000,
    JSON_ARRAY('/uploads/pitch1_1.jpg', '/uploads/pitch1_2.jpg'),
    JSON_ARRAY('Bãi đỗ xe', 'Nhà vệ sinh', 'Quán nước', 'Khu thay đồ'),
    'active'
),
(
    'Sân bóng Kỹ Nguyễn',
    '7v7',
    'Quận 3, TP HCM',
    '456 Đường Nguyễn Huệ, Quận 3, TP HCM',
    'Sân cỏ nhân tạo chất lượng, ánh sáng đầy đủ',
    14,
    200000,
    JSON_ARRAY('/uploads/pitch2_1.jpg', '/uploads/pitch2_2.jpg'),
    JSON_ARRAY('Bãi đỗ xe', 'Nhà vệ sinh', 'Máy lạnh', 'Wifi miễn phí'),
    'active'
),
(
    'Sân bóng Bầu Trời',
    '5v5',
    'Quận 7, TP HCM',
    '789 Đường Nguyễn Văn Linh, Quận 7, TP HCM',
    'Sân trong nhà có mái che, tránh nắng mưa',
    10,
    120000,
    JSON_ARRAY('/uploads/pitch3_1.jpg'),
    JSON_ARRAY('Bãi đỗ xe', 'Khu thay đồ', 'Bóng đá'),
    'active'
),
(
    'Sân bóng Sao Vàng',
    '7v7',
    'Bình Thạnh, TP HCM',
    '321 Đường Xô Viết Nghệ Tĩnh, Bình Thạnh, TP HCM',
    'Sân tiêu chuẩn FIFA, có hệ thống tưới tự động',
    14,
    180000,
    JSON_ARRAY('/uploads/pitch4_1.jpg', '/uploads/pitch4_2.jpg', '/uploads/pitch4_3.jpg'),
    JSON_ARRAY('Bãi đỗ xe miễn phí', 'Nhà vệ sinh', 'Quán nước', 'Wifi', 'Camera an ninh'),
    'active'
),
(
    'Sân bóng Phượng Hoàng',
    '5v5',
    'Quận 10, TP HCM',
    '654 Đường 3 Tháng 2, Quận 10, TP HCM',
    'Không gian rộng rãi, thoáng mát',
    10,
    130000,
    JSON_ARRAY('/uploads/pitch5_1.jpg'),
    JSON_ARRAY('Nhà vệ sinh', 'Máy lạnh'),
    'maintenance'
);

-- ================================================================
-- 3. TIMESLOTS - Khung giờ (Tạo cho 7 ngày tới)
-- ================================================================
-- Sân 1 - Các khung giờ
INSERT INTO timeslots (pitch_id, date, start_time, end_time, price, is_available) VALUES
(1, CURDATE(), '06:00:00', '08:00:00', 150000, TRUE),
(1, CURDATE(), '08:00:00', '10:00:00', 150000, TRUE),
(1, CURDATE(), '10:00:00', '12:00:00', 150000, FALSE),
(1, CURDATE(), '14:00:00', '16:00:00', 150000, TRUE),
(1, CURDATE(), '16:00:00', '18:00:00', 150000, TRUE),
(1, CURDATE(), '18:00:00', '20:00:00', 180000, TRUE),
(1, CURDATE(), '20:00:00', '22:00:00', 180000, FALSE),

(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '06:00:00', '08:00:00', 150000, TRUE),
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00:00', '10:00:00', 150000, TRUE),
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:00:00', '20:00:00', 180000, TRUE),
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:00:00', '22:00:00', 180000, TRUE);

-- Sân 2 - Các khung giờ
INSERT INTO timeslots (pitch_id, date, start_time, end_time, price, is_available) VALUES
(2, CURDATE(), '07:00:00', '09:00:00', 200000, TRUE),
(2, CURDATE(), '09:00:00', '11:00:00', 200000, TRUE),
(2, CURDATE(), '11:00:00', '13:00:00', 200000, TRUE),
(2, CURDATE(), '15:00:00', '17:00:00', 200000, TRUE),
(2, CURDATE(), '17:00:00', '19:00:00', 230000, FALSE),
(2, CURDATE(), '19:00:00', '21:00:00', 230000, TRUE),

(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '07:00:00', '09:00:00', 200000, TRUE),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '17:00:00', '19:00:00', 230000, TRUE);

-- ================================================================
-- 4. SERVICES - Dịch vụ bổ sung
-- ================================================================
INSERT INTO services (name, description, price, unit, category, status) VALUES
('Áo bib', 'Bộ áo phân đội màu khác nhau', 5000, 'cái', 'equipment', 'active'),
('Bóng thi đấu', 'Bóng FIFA chính hãng', 10000, 'trái', 'equipment', 'active'),
('Nước suối', 'Nước suối lạnh 500ml', 10000, 'chai', 'beverage', 'active'),
('Nước thể thao', 'Nước thể thao Pocari/Aquarius 500ml', 20000, 'chai', 'beverage', 'active'),
('Thuê trọng tài', 'Trọng tài có kinh nghiệm tại sân', 200000, 'trận', 'other', 'active');

-- ================================================================
-- 5. BOOKINGS - Đơn đặt sân mẫu
-- ================================================================
INSERT INTO bookings (booking_code, user_id, pitch_id, timeslot_id, booking_date, start_time, end_time, total_price, deposit_amount, customer_name, customer_phone, customer_email, status) VALUES
('BK001', 2, 1, 1, CURDATE(), '06:00:00', '08:00:00', 150000, 50000, 'Nguyễn Văn A', '0912345678', 'nguyenvana@example.com', 'confirmed'),
('BK002', 3, 2, 14, CURDATE(), '07:00:00', '09:00:00', 400000, 150000, 'Trần Thị B', '0923456789', 'tranthib@example.com', 'pending'),
('BK003', 4, 1, 3, CURDATE(), '10:00:00', '12:00:00', 120000, 0, 'Lê Văn C', '0934567890', 'levanc@example.com', 'confirmed'),
('BK004', 5, 2, 17, CURDATE(), '15:00:00', '17:00:00', 180000, 100000, 'Phạm Văn D', '0945678901', 'phamvand@example.com', 'completed'),
('BK005', 6, 1, 7, CURDATE(), '20:00:00', '22:00:00', 130000, 0, 'Hoàng Thị E', '0956789012', 'hoangthie@example.com', 'cancelled');

-- ================================================================
-- 6. BOOKING_SERVICES - Dịch vụ kèm theo đơn đặt
-- ================================================================
INSERT INTO booking_services (booking_id, service_id, quantity, price, total) VALUES
(1, 1, 2, 5000, 10000),
(1, 3, 10, 10000, 100000),
(2, 2, 1, 10000, 10000),
(2, 4, 5, 20000, 100000),
(4, 5, 1, 200000, 200000);

-- ================================================================
-- 7. PAYMENTS - Thanh toán
-- ================================================================
INSERT INTO payments (booking_id, payment_method, amount, status, transaction_id) VALUES
(1, 'cash', 150000, 'completed', NULL),
(2, 'transfer', 150000, 'completed', 'TXN20250123001'),
(3, 'cash', 120000, 'completed', NULL),
(4, 'momo', 380000, 'completed', 'MOMO20250123002'),
(5, 'cash', 0, 'refunded', NULL);

-- ================================================================
-- 8. REVIEWS - Đánh giá
-- ================================================================
INSERT INTO reviews (booking_id, user_id, pitch_id, rating, comment) VALUES
(1, 2, 1, 5, 'Sân rất đẹp, chất lượng tốt, nhân viên nhiệt tình!'),
(3, 4, 1, 4, 'Sân ổn, giá hợp lý. Sẽ quay lại!'),
(4, 5, 2, 5, 'Sân chất lượng cao, không gian thoải mái, đặt lại chắc chắn.');

-- ================================================================
-- HOÀN TẤT SEED DATA
-- ================================================================
