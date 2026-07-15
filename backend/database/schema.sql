-- Create Database
CREATE DATABASE IF NOT EXISTS hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_db;

-- Users / Doctors Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(255) NOT NULL,
  nationalId VARCHAR(50),
  gender VARCHAR(20) DEFAULT 'Nam',
  dob DATE,
  doctorId VARCHAR(50),
  address TEXT,
  specialty VARCHAR(255),
  department VARCHAR(255),
  avatar VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200',
  staffId VARCHAR(50),
  accountType VARCHAR(50) DEFAULT 'Bác sĩ',
  certifications JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  age INT NOT NULL,
  avatar VARCHAR(50),
  history JSON, -- JSON array of strings
  status VARCHAR(50) NOT NULL, -- treating, critical, recheck, discharged
  statusText VARCHAR(100) NOT NULL,
  avatarBg VARCHAR(50),
  avatarColor VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(50) PRIMARY KEY,
  stt VARCHAR(10) NOT NULL,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  gender VARCHAR(20) NOT NULL,
  dob DATE NOT NULL,
  symptom TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- confirmed, pending
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed Initial Doctor User
-- Default password: 'password123' (hashed using bcrypt)
INSERT INTO users (username, password, fullName, nationalId, gender, dob, doctorId, address, specialty, department, staffId, accountType, certifications)
SELECT 'doctor_an', '$2a$10$h9W8.3zRmdZ3hG/Z3d5HVeIu4Gz/oUlyXW.X8g1f4i4BPltI6C8c6', 'Nguyễn Thành An', '079185002931', 'Nam', '1985-10-15', 'DOC-AN-001', '128/4 Nguyễn Trãi, Phường 3, Quận 5, TP. Hồ Chí Minh', 'Nội tổng quát', 'Khoa Nội 1 - Tòa nhà A', 'DR-2024-0082', 'Quản trị viên', '[{"title": "BSCK II - Nội khoa", "detail": "Xác thực bởi Bộ Y tế", "icon": "fas fa-user-shield", "bg": "#ecfdf5", "color": "#059669"}, {"title": "12 năm kinh nghiệm", "detail": "Bệnh viện Chợ Rẫy", "icon": "fas fa-history", "bg": "#f0fdfa", "color": "#0d9488"}]'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'doctor_an');

-- Seed Mock Patients
INSERT INTO patients (id, name, gender, age, avatar, history, status, statusText, avatarBg, avatarColor)
VALUES 
('PT-29402', 'Eleanor Shellstrop', 'Nữ', 34, 'ES', '["Cao huyết áp", "Tiểu đường Type II"]', 'treating', 'Đang điều trị', '#e0f2fe', '#0369a1'),
('PT-18394', 'Arthur Morgan', 'Nam', 68, 'AM', '["Hậu phẫu"]', 'critical', 'Nguy kịch', '#fee2e2', '#b91c1c'),
('PT-48201', 'Jason Mendoza', 'Nam', 29, 'JM', '["Khám định kỳ"]', 'recheck', 'Tái khám', '#f3f4f6', '#374151'),
('PT-55120', 'Tahani Al-Jamil', 'Nữ', 31, 'TA', '["Hen suyễn", "Dị ứng"]', 'discharged', 'Đã xuất viện', '#f3e8ff', '#6b21a8')
ON DUPLICATE KEY UPDATE name=name;

-- Seed Mock Appointments
INSERT INTO appointments (id, stt, name, date, gender, dob, symptom, status)
VALUES
('APP-001', '01', 'Nguyễn Văn A', '2025-06-17', 'Nam', '2004-06-06', 'Khó thở', 'confirmed'),
('APP-002', '02', 'Nguyễn Thị B', '2025-06-17', 'Nữ', '2004-08-14', 'Khó thở', 'pending'),
('APP-003', '03', 'Nguyễn Văn D', '2025-06-17', 'Nam', '2004-10-08', 'Đau đầu', 'pending'),
('APP-004', '04', 'Nguyễn Văn E', '2025-06-17', 'Nam', '2004-08-01', 'Nghẹt mũi', 'confirmed')
ON DUPLICATE KEY UPDATE name=name;
