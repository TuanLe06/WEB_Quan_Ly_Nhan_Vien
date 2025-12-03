-- ==========================================
-- HỆ THỐNG QUẢN LÝ NHÂN VIÊN
-- SQL SCHEMA HOÀN CHỈNH (ĐÃ BAO GỒM CÁC CỘT BẠN MUỐN THÊM)
-- ==========================================

DROP DATABASE IF EXISTS QuanLyNhanVien;
CREATE DATABASE QuanLyNhanVien CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE QuanLyNhanVien;

-- ==========================================
-- 1. BẢNG PHÒNG BAN
-- ==========================================
CREATE TABLE PHONGBAN (
    ma_phong CHAR(3) PRIMARY KEY,
    ten_phong VARCHAR(100) NOT NULL,
    nam_thanh_lap YEAR NOT NULL,
    trang_thai TINYINT DEFAULT 1 COMMENT '1: hoạt động, 0: ngưng',
    INDEX idx_trang_thai (trang_thai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 2. BẢNG CHỨC VỤ
-- ==========================================
CREATE TABLE CHUCVU (
    ma_chuc_vu CHAR(1) PRIMARY KEY,
    ten_chuc_vu VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 3. BẢNG NHÂN VIÊN (ĐÃ TÍCH HỢP CỘT AVATAR + LIÊN HỆ)
-- ==========================================
CREATE TABLE NHANVIEN (
    ma_nv VARCHAR(10) PRIMARY KEY,
    ten_nv VARCHAR(100) NOT NULL,
    ngay_sinh DATE NOT NULL,
    gioi_tinh VARCHAR(10) NOT NULL,
    ma_phong CHAR(3) NOT NULL,
    ma_chucvu CHAR(1) NOT NULL,
    luong_co_ban DECIMAL(12,2) NOT NULL DEFAULT 0,
    ngay_vao_lam DATE NOT NULL,
    trang_thai TINYINT DEFAULT 1 COMMENT '1: đang làm, 0: đã nghỉ',

    -- Các cột mới
    avatar TEXT NULL COMMENT 'Base64 encoded avatar image',
    dia_chi VARCHAR(255) NULL,
    so_dien_thoai VARCHAR(20) NULL,
    email VARCHAR(100) NULL,

    FOREIGN KEY (ma_phong) REFERENCES PHONGBAN(ma_phong) ON UPDATE CASCADE,
    FOREIGN KEY (ma_chucvu) REFERENCES CHUCVU(ma_chuc_vu) ON UPDATE CASCADE,
    INDEX idx_phong (ma_phong),
    INDEX idx_chucvu (ma_chucvu),
    INDEX idx_trang_thai (trang_thai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 4. BẢNG CHẤM CÔNG (ĐÃ TÍCH HỢP CỘT TRẠNG THÁI)
-- ==========================================
CREATE TABLE CHAMCONG (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_nv VARCHAR(10) NOT NULL,
    ngay_lam DATE NOT NULL,
    gio_vao TIME NOT NULL,
    gio_ra TIME DEFAULT NULL,
    so_gio FLOAT DEFAULT 0,

    -- Cột mới
    trang_thai VARCHAR(20) DEFAULT 'Đúng giờ' COMMENT 'Đúng giờ / Muộn',

    FOREIGN KEY (ma_nv) REFERENCES NHANVIEN(ma_nv) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_chamcong (ma_nv, ngay_lam),
    INDEX idx_ngay_lam (ngay_lam),
    INDEX idx_ma_nv (ma_nv)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 5. BẢNG LƯƠNG
-- ==========================================
CREATE TABLE LUONG (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_nv VARCHAR(10) NOT NULL,
    thang INT NOT NULL CHECK (thang BETWEEN 1 AND 12),
    nam INT NOT NULL CHECK (nam >= 2000),
    tong_gio FLOAT DEFAULT 0,
    luong_them DECIMAL(12,2) DEFAULT 0,
    luong_thuc_nhan DECIMAL(12,2) DEFAULT 0,
    ngay_tinh DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ma_nv) REFERENCES NHANVIEN(ma_nv)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_luong (ma_nv, thang, nam),
    INDEX idx_thang_nam (thang, nam),
    INDEX idx_ma_nv (ma_nv)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 6. BẢNG NGHỈ PHÉP
-- ==========================================
CREATE TABLE NGHIPHEP (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_nv VARCHAR(10) NOT NULL,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    loai_phep VARCHAR(50) NOT NULL,
    ly_do TEXT,
    trang_thai VARCHAR(20) DEFAULT 'Chờ duyệt',
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ma_nv) REFERENCES NHANVIEN(ma_nv)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (ngay_ket_thuc >= ngay_bat_dau),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_ma_nv (ma_nv),
    INDEX idx_ngay (ngay_bat_dau, ngay_ket_thuc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 7. BẢNG HỢP ĐỒNG (ĐÃ TÍCH HỢP LƯƠNG CƠ BẢN + PHỤ CẤP + NỘI DUNG)
-- ==========================================
CREATE TABLE HOPDONG (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_nv VARCHAR(10) NOT NULL,
    loai_hop_dong VARCHAR(50) NOT NULL,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE DEFAULT NULL,
    file_hop_dong VARCHAR(255) DEFAULT NULL,

    -- Các cột mới
    luong_co_ban DECIMAL(12,2) DEFAULT 0,
    phu_cap DECIMAL(12,2) DEFAULT 0,
    noi_dung TEXT NULL,

    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ma_nv) REFERENCES NHANVIEN(ma_nv)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_ma_nv (ma_nv),
    INDEX idx_ngay_ket_thuc (ngay_ket_thuc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 8. BẢNG NGƯỜI DÙNG
-- ==========================================
CREATE TABLE NGUOIDUNG (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    vai_tro ENUM('Admin', 'NhanVien', 'KeToan') NOT NULL DEFAULT 'NhanVien',
    ma_nv VARCHAR(10) DEFAULT NULL,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    lan_dang_nhap_cuoi DATETIME DEFAULT NULL,

    FOREIGN KEY (ma_nv) REFERENCES NHANVIEN(ma_nv)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_vai_tro (vai_tro),
    INDEX idx_ma_nv (ma_nv)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- PROCEDURES, TRIGGERS, VIEWS (giữ nguyên như bản cũ)
-- ==========================================

-- Procedure tính số giờ làm
DELIMITER //
CREATE PROCEDURE TinhSoGioLamViec(IN p_id INT)
BEGIN
    UPDATE CHAMCONG 
    SET so_gio = TIMESTAMPDIFF(MINUTE, gio_vao, gio_ra) / 60
    WHERE id = p_id AND gio_ra IS NOT NULL;
END //

-- Procedure tính lương tháng
CREATE PROCEDURE TinhLuongThang(IN p_ma_nv VARCHAR(10), IN p_thang INT, IN p_nam INT)
BEGIN
    DECLARE v_tong_gio FLOAT;
    DECLARE v_luong_co_ban DECIMAL(12,2);
    DECLARE v_luong_them DECIMAL(12,2);
    DECLARE v_luong_thuc_nhan DECIMAL(12,2);

    SELECT COALESCE(SUM(so_gio), 0) INTO v_tong_gio
    FROM CHAMCONG
    WHERE ma_nv = p_ma_nv AND MONTH(ngay_lam) = p_thang AND YEAR(ngay_lam) = p_nam;

    SELECT luong_co_ban INTO v_luong_co_ban FROM NHANVIEN WHERE ma_nv = p_ma_nv;

    IF v_tong_gio <= 40 THEN
        SET v_luong_them = 0;
        SET v_luong_thuc_nhan = v_luong_co_ban;
    ELSE
        SET v_luong_them = (v_tong_gio - 40) * (v_luong_co_ban / 40) * 1.5;
        SET v_luong_thuc_nhan = v_luong_co_ban + v_luong_them;
    END IF;

    INSERT INTO LUONG (ma_nv, thang, nam, tong_gio, luong_them, luong_thuc_nhan)
    VALUES (p_ma_nv, p_thang, p_nam, v_tong_gio, v_luong_them, v_luong_thuc_nhan)
    ON DUPLICATE KEY UPDATE
        tong_gio = v_tong_gio,
        luong_them = v_luong_them,
        luong_thuc_nhan = v_luong_thuc_nhan,
        ngay_tinh = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger tính giờ
DELIMITER //
CREATE TRIGGER trg_TinhGioLamViec 
BEFORE UPDATE ON CHAMCONG
FOR EACH ROW
BEGIN
    IF NEW.gio_ra IS NOT NULL THEN
        SET NEW.so_gio = TIMESTAMPDIFF(MINUTE, NEW.gio_vao, NEW.gio_ra) / 60;
    END IF;
END //
DELIMITER ;

-- Views (giữ nguyên)
