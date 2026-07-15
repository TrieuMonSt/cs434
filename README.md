# CarePlus Hospital OS - Hệ thống Quản lý Bệnh viện

Dự án Quản lý Bệnh viện CarePlus viết bằng **Vue 3 (Vite + SFC)** cho Frontend và **NodeJS (Express + MySQL)** cho Backend.

## Hướng dẫn cài đặt & Khởi chạy dự án cho Thành viên mới

Để chạy được dự án trên máy cá nhân, vui lòng thực hiện các bước sau:

### 1. Chuẩn bị Cơ sở dữ liệu (MySQL)
1. Mở phần mềm **Laragon** (hoặc XAMPP) và khởi động dịch vụ **MySQL**.
2. Không cần tạo sẵn database bằng tay, hệ thống sẽ tự động khởi tạo khi chạy tập lệnh di chuyển dữ liệu.

### 2. Cài đặt Cấu hình Môi trường (Environment)
1. Truy cập thư mục `/backend`.
2. Tạo một file tên là `.env` bằng cách sao chép từ file mẫu:
   ```bash
   cp .env.example .env
   ```
3. Cấu hình lại thông tin đăng nhập database MySQL trong file `.env` nếu cần (như `DB_USER`, `DB_PASSWORD`, `DB_PORT`).

### 3. Cài đặt các thư viện dependencies
Chạy lệnh cài đặt cho cả thư mục gốc (Frontend) và thư mục `/backend` (Backend):
```bash
# Cài đặt thư viện cho Frontend
npm install

# Cài đặt thư viện cho Backend
cd backend
npm install
cd ..
```

### 4. Thiết lập Cơ sở dữ liệu (MySQL)
Lưu ý: Hệ thống yêu cầu cơ sở dữ liệu MySQL hoạt động. Bạn cần tự thiết kế cấu trúc bảng và import cấu trúc CSDL vào máy trước khi chạy ứng dụng (Các file cấu trúc CSDL và seed mẫu được giữ bảo mật trên máy chính).


### 5. Khởi chạy dự án

Bạn cần mở 2 cửa sổ terminal độc lập để chạy đồng thời cả Frontend và Backend:

* **Cửa sổ 1: Chạy Backend API**
  ```bash
  cd backend
  npm run dev
  ```
  API sẽ chạy tại địa chỉ: `http://localhost:5000`

* **Cửa sổ 2: Chạy Frontend App**
  ```bash
  npm run dev
  ```
  Giao diện sẽ chạy tại địa chỉ: `http://localhost:5173` (hoặc cổng hiển thị trên terminal).

---

## Tài khoản đăng nhập kiểm thử (Mock Accounts)
Sau khi chạy migrate, hệ thống có sẵn các tài khoản sau để đăng nhập kiểm thử:
- Tài khoản: **`doctor_an`** | Mật khẩu: **`password123`** (Quyền: Quản trị viên)
- Bạn cũng có thể dùng nút đăng ký trực tiếp trên giao diện để tạo mới một tài khoản Bác sĩ bất kỳ.
