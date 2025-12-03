-- ==========================================
-- HỆ THỐNG QUẢN LÝ NHÂN VIÊN
-- Seed Data - Dữ liệu mẫu (UPDATED WITH STATUS)
-- ==========================================

USE QuanLyNhanVien;

-- ==========================================
-- DỮ LIỆU PHÒNG BAN
-- ==========================================
INSERT INTO PHONGBAN (ma_phong, ten_phong, nam_thanh_lap, trang_thai) VALUES
('PDA', 'Phòng Điều Hành', 2020, 1),
('PKT', 'Phòng Kế Toán', 2020, 1),
('PKD', 'Phòng Kinh Doanh', 2021, 1),
('PIT', 'Phòng Công Nghệ Thông Tin', 2021, 1),
('PNS', 'Phòng Nhân Sự', 2022, 1);

-- ==========================================
-- DỮ LIỆU CHỨC VỤ
-- ==========================================
INSERT INTO CHUCVU (ma_chuc_vu, ten_chuc_vu) VALUES
('T', 'Trưởng phòng'),
('P', 'Phó phòng'),
('N', 'Nhân viên'),
('S', 'Thực tập sinh');

-- ==========================================
-- DỮ LIỆU NHÂN VIÊN
-- ==========================================
INSERT INTO NHANVIEN (ma_nv, ten_nv, ngay_sinh, gioi_tinh, ma_phong, ma_chucvu, luong_co_ban, ngay_vao_lam, trang_thai) VALUES
-- Phòng Điều Hành
('PDAT0001', 'Nguyễn Văn An', '1985-05-15', 'Nam', 'PDA', 'T', 25000000, '2020-01-10', 1),
('PDAN0001', 'Trần Thị Bình', '1990-08-20', 'Nữ', 'PDA', 'N', 15000000, '2020-03-15', 1),

-- Phòng Kế Toán
('PKTT0001', 'Lê Văn Cường', '1988-03-10', 'Nam', 'PKT', 'T', 20000000, '2020-02-01', 1),
('PKTN0001', 'Phạm Thị Dung', '1992-11-25', 'Nữ', 'PKT', 'N', 12000000, '2020-06-01', 1),
('PKTN0002', 'Hoàng Văn Em', '1995-07-08', 'Nam', 'PKT', 'N', 11000000, '2021-01-15', 1),

-- Phòng Kinh Doanh
('PKDT0001', 'Vũ Thị Phương', '1987-09-30', 'Nữ', 'PKD', 'T', 22000000, '2021-06-01', 1),
('PKDN0001', 'Đỗ Văn Giang', '1993-04-12', 'Nam', 'PKD', 'N', 13000000, '2021-08-10', 1),
('PKDN0002', 'Bùi Thị Hương', '1994-12-05', 'Nữ', 'PKD', 'N', 13500000, '2021-09-20', 1),
('PKDN0003', 'Ngô Văn Inh', '1996-02-28', 'Nam', 'PKD', 'N', 12500000, '2022-03-01', 1),

-- Phòng CNTT
('PITT0001', 'Đinh Văn Khánh', '1990-06-18', 'Nam', 'PIT', 'T', 30000000, '2021-06-15', 1),
('PITP0001', 'Trương Thị Lan', '1991-10-22', 'Nữ', 'PIT', 'P', 25000000, '2021-07-01', 1),
('PITN0001', 'Lý Văn Minh', '1995-01-14', 'Nam', 'PIT', 'N', 18000000, '2022-01-10', 1),
('PITN0002', 'Mai Thị Nga', '1996-08-30', 'Nữ', 'PIT', 'N', 17000000, '2022-02-15', 1),
('PITS0001', 'Phan Văn Oanh', '2000-11-11', 'Nam', 'PIT', 'S', 8000000, '2023-09-01', 1),

-- Phòng Nhân Sự
('PNST0001', 'Chu Thị Phương', '1989-03-25', 'Nữ', 'PNS', 'T', 18000000, '2022-01-05', 1),
('PNSN0001', 'Dương Văn Quang', '1994-05-17', 'Nam', 'PNS', 'N', 13000000, '2022-03-20', 1);

-- ==========================================
-- DỮ LIỆU NGƯỜI DÙNG (bcrypt: "password")
-- ==========================================
INSERT INTO NGUOIDUNG (username, password, vai_tro, ma_nv) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', NULL),
('nva', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'PDAT0001'),
('ttb', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'NhanVien', 'PDAN0001'),
('lvc', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'KeToan', 'PKTT0001'),
('dvk', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'PITT0001');

-- ==========================================
-- CHẤM CÔNG (Tháng hiện tại) - WITH STATUS
-- ==========================================
INSERT INTO CHAMCONG (ma_nv, ngay_lam, gio_vao, gio_ra, so_gio, trang_thai) VALUES
-- Tuần 1 - Đúng giờ và đủ giờ
('PDAT0001', CURDATE() - INTERVAL 20 DAY, '08:00:00', '17:00:00', 8, 'Đúng giờ'),
('PDAT0001', CURDATE() - INTERVAL 19 DAY, '08:10:00', '17:30:00', 8.33, 'Đúng giờ'),
('PDAT0001', CURDATE() - INTERVAL 18 DAY, '08:00:00', '17:00:00', 8, 'Đúng giờ'),

-- Tuần 1 - Một số người muộn
('PKTT0001', CURDATE() - INTERVAL 20 DAY, '08:05:00', '17:10:00', 8.08, 'Đúng giờ'),
('PKTT0001', CURDATE() - INTERVAL 19 DAY, '08:20:00', '18:00:00', 9.67, 'Muộn'),
('PITN0001', CURDATE() - INTERVAL 20 DAY, '08:00:00', '17:00:00', 8, 'Đúng giờ'),
('PITN0001', CURDATE() - INTERVAL 19 DAY, '08:30:00', '17:00:00', 8.5, 'Muộn'),

-- Tuần 2
('PDAT0001', CURDATE() - INTERVAL 13 DAY, '08:00:00', '17:00:00', 8, 'Đúng giờ'),
('PKTT0001', CURDATE() - INTERVAL 13 DAY, '08:00:00', '17:00:00', 8, 'Đúng giờ'),
('PITN0001', CURDATE() - INTERVAL 13 DAY, '08:25:00', '17:15:00', 8.83, 'Muộn'),
('PITN0002', CURDATE() - INTERVAL 13 DAY, '08:00:00', '16:30:00', 8.5, 'Đúng giờ'),

-- Tuần 3
('PDAT0001', CURDATE() - INTERVAL 6 DAY, '08:00:00', '17:00:00', 8, 'Đúng giờ'),
('PKTT0001', CURDATE() - INTERVAL 6 DAY, '08:16:00', '17:00:00', 8.73, 'Muộn'),
('PITN0001', CURDATE() - INTERVAL 6 DAY, '08:00:00', '17:00:00', 8, 'Đúng giờ'),
('PKDN0001', CURDATE() - INTERVAL 6 DAY, '08:45:00', '17:30:00', 8.75, 'Muộn'),

-- Hôm nay - Một số đã checkout, một số chưa
('PDAT0001', CURDATE(), '08:00:00', '17:00:00', 8, 'Đúng giờ'),
('PKTT0001', CURDATE(), '08:05:00', NULL, 0, 'Đúng giờ'),
('PITN0001', CURDATE(), '08:20:00', NULL, 0, 'Muộn'),
('PITN0002', CURDATE(), '08:00:00', '17:15:00', 8.25, 'Đúng giờ');

-- ==========================================
-- NGHỈ PHÉP
-- ==========================================
INSERT INTO NGHIPHEP (ma_nv, ngay_bat_dau, ngay_ket_thuc, loai_phep, ly_do, trang_thai) VALUES
('PDAN0001', CURDATE() + INTERVAL 5 DAY, CURDATE() + INTERVAL 7 DAY, 'Nghỉ phép năm', 'Về quê', 'Chờ duyệt'),
('PITN0002', CURDATE() + INTERVAL 3 DAY, CURDATE() + INTERVAL 3 DAY, 'Nghỉ ốm', 'Bị cảm', 'Chờ duyệt'),
('PKDN0002', CURDATE() - INTERVAL 10 DAY, CURDATE() - INTERVAL 8 DAY, 'Nghỉ phép năm', 'Du lịch', 'Đã duyệt');

-- ==========================================
-- HỢP ĐỒNG
-- ==========================================
INSERT INTO HOPDONG (ma_nv, loai_hop_dong, ngay_bat_dau, ngay_ket_thuc, file_hop_dong) VALUES
('PDAT0001', 'Vô thời hạn', '2020-01-10', NULL, NULL),
('PKTT0001', 'Vô thời hạn', '2020-02-01', NULL, NULL),
('PITT0001', 'Vô thời hạn', '2021-06-15', NULL, NULL),
('PITN0001', 'Có thời hạn', '2022-01-10', '2024-01-10', NULL),
('PITN0002', 'Có thời hạn', '2022-02-15', '2024-02-15', NULL),
('PITS0001', 'Thử việc', '2023-09-01', '2023-11-01', NULL),
('PNSN0001', 'Có thời hạn', '2022-03-20', CURDATE() + INTERVAL 45 DAY, NULL);

-- ==========================================
-- HOÀN TẤT & THỐNG KÊ
-- ==========================================
SELECT 'Sample data inserted successfully!' AS Status;

SELECT 'Tổng số phòng ban:' AS Info, COUNT(*) AS Count FROM PHONGBAN
UNION ALL
SELECT 'Tổng số nhân viên:', COUNT(*) FROM NHANVIEN
UNION ALL
SELECT 'Tổng số người dùng:', COUNT(*) FROM NGUOIDUNG
UNION ALL
SELECT 'Tổng số bản ghi chấm công:', COUNT(*) FROM CHAMCONG
UNION ALL
SELECT 'Số người đi muộn:', COUNT(*) FROM CHAMCONG WHERE trang_thai = 'Muộn'
UNION ALL
SELECT 'Số người đúng giờ:', COUNT(*) FROM CHAMCONG WHERE trang_thai = 'Đúng giờ';