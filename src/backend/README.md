# HỆ THỐNG QUẢN LÝ NHÂN VIÊN - BACKEND API

Backend API cho hệ thống quản lý nhân viên sử dụng Node.js, Express và MySQL.

## 📋 YÊU CẦU HỆ THỐNG

- Node.js >= 14.x
- MySQL >= 8.0
- npm hoặc yarn

## 🚀 HƯỚNG DẪN CÀI ĐẶT

### 1. Clone project và cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình Database

Chạy script SQL để tạo database:
```bash
mysql -u root -p < database.sql
```

Hoặc import file SQL thông qua MySQL Workbench/phpMyAdmin.

### 3. Cấu hình biến môi trường

Tạo file `.env` từ file `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin database của bạn:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=QuanLyNhanVien

JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### 4. Chạy server

**Development mode (với nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📚 API ENDPOINTS

### 🔐 Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký (Admin)
- `PUT /api/auth/change-password` - Đổi mật khẩu
- `GET /api/auth/me` - Thông tin user hiện tại

### 👥 Employees
- `GET /api/employees` - Danh sách nhân viên
- `GET /api/employees/:id` - Chi tiết nhân viên
- `POST /api/employees` - Thêm nhân viên
- `PUT /api/employees/:id` - Cập nhật nhân viên
- `DELETE /api/employees/:id` - Xóa nhân viên
- `GET /api/employees/stats` - Thống kê nhân viên

### 🏢 Departments
- `GET /api/departments` - Danh sách phòng ban
- `GET /api/departments/:id` - Chi tiết phòng ban
- `POST /api/departments` - Thêm phòng ban
- `PUT /api/departments/:id` - Cập nhật phòng ban
- `DELETE /api/departments/:id` - Xóa phòng ban

### 💼 Positions
- `GET /api/positions` - Danh sách chức vụ
- `POST /api/positions` - Thêm chức vụ
- `PUT /api/positions/:id` - Cập nhật chức vụ
- `DELETE /api/positions/:id` - Xóa chức vụ

### ⏰ Attendance
- `POST /api/attendance/checkin` - Check-in
- `POST /api/attendance/checkout` - Check-out
- `GET /api/attendance/today` - Chấm công hôm nay
- `GET /api/attendance/history/:ma_nv` - Lịch sử chấm công
- `GET /api/attendance/stats` - Thống kê chấm công
- `GET /api/attendance/late` - Nhân viên đi muộn
- `GET /api/attendance/not-checked-out` - Chưa checkout

### 💰 Salary
- `POST /api/salary/calculate` - Tính lương 1 nhân viên
- `POST /api/salary/calculate-all` - Tính lương tất cả
- `GET /api/salary/monthly` - Bảng lương tháng
- `GET /api/salary/employee/:ma_nv` - Lương của nhân viên
- `GET /api/salary/top` - Top lương cao nhất
- `GET /api/salary/by-department` - Lương theo phòng ban
- `GET /api/salary/compare` - So sánh lương theo tháng

### 🏖️ Leave
- `POST /api/leave` - Gửi yêu cầu nghỉ phép
- `GET /api/leave` - Danh sách yêu cầu
- `GET /api/leave/:id` - Chi tiết yêu cầu
- `PUT /api/leave/:id/status` - Duyệt/Từ chối
- `GET /api/leave/today` - Nghỉ phép hôm nay
- `GET /api/leave/stats` - Thống kê nghỉ phép

### 📄 Contracts
- `GET /api/contracts` - Danh sách hợp đồng
- `GET /api/contracts/:id` - Chi tiết hợp đồng
- `POST /api/contracts` - Thêm hợp đồng
- `PUT /api/contracts/:id` - Cập nhật hợp đồng
- `DELETE /api/contracts/:id` - Xóa hợp đồng
- `GET /api/contracts/expiring` - Hợp đồng sắp hết hạn
- `GET /api/contracts/expired` - Hợp đồng đã hết hạn
- `GET /api/contracts/stats` - Thống kê hợp đồng

### 📊 Dashboard
- `GET /api/dashboard/stats` - Thống kê tổng quan
- `GET /api/dashboard/employees-by-department` - Nhân viên theo phòng
- `GET /api/dashboard/employees-by-position` - Nhân viên theo chức vụ
- `GET /api/dashboard/salary-trend` - Xu hướng lương
- `GET /api/dashboard/attendance-stats` - Thống kê chấm công
- `GET /api/dashboard/top-employees` - Top nhân viên
- `GET /api/dashboard/leave-stats` - Thống kê nghỉ phép
- `GET /api/dashboard/recent-activities` - Hoạt động gần đây

## 🔑 AUTHENTICATION

API sử dụng JWT Bearer Token. Thêm token vào header:

```
Authorization: Bearer your_token_here
```

## 👤 PHÂN QUYỀN

### Admin
- Toàn quyền quản lý hệ thống
- Quản lý nhân viên, phòng ban, chức vụ
- Duyệt nghỉ phép, quản lý hợp đồng
- Xem tất cả báo cáo

### Kế Toán
- Xem và tính lương
- Xem báo cáo tài chính
- Xem thông tin nhân viên

### Nhân Viên
- Xem thông tin cá nhân
- Check-in/Check-out
- Gửi yêu cầu nghỉ phép
- Xem bảng lương của mình

## 📝 RESPONSE FORMAT

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "count": 10
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details"
}
```

## 🧪 TESTING API

Sử dụng Postman hoặc các công cụ tương tự để test API.

**Account mặc định:**
- Username: `admin`
- Password: `password`

## 🛠️ CẤU TRÚC THƯ MỤC

```
backend/
├── config/
│   └── database.js             # Cấu hình database
├── controllers/                # Controllers xử lý logic
│   ├── authController.js
│   ├── employeeController.js
│   ├── departmentController.js
│   ├── positionController.js
│   ├── attendanceController.js
│   ├── salaryController.js
│   ├── leaveController.js
│   ├── contractController.js
│   └── dashboardController.js
├── middleware/                 # Middleware
│   ├── auth.js                # JWT authentication
│   └── roleCheck.js           # Role-based access control
├── routes/                     # API routes
│   ├── auth.js
│   ├── employees.js
│   ├── departments.js
│   ├── positions.js
│   ├── attendance.js
│   ├── salary.js
│   ├── leave.js
│   ├── contracts.js
│   └── dashboard.js
├── models/                     # Database models
│   └── index.js               # Base model & specific models
├── utils/                      # Utility functions
│   ├── generateEmployeeId.js  # Sinh mã nhân viên tự động
│   ├── calculateSalary.js     # Tính lương
│   ├── validators.js          # Validation functions
│   ├── dateHelper.js          # Date/time helpers
│   ├── responseHelper.js      # API response helpers
│   ├── constants.js           # Hằng số hệ thống
│   └── index.js               # Export tất cả utils
├── .env                        # Biến môi trường
├── .gitignore                  # Git ignore file
├── package.json               # Dependencies
├── server.js                  # Entry point
└── README.md                  # Documentation
```

## 🐛 DEBUGGING

Bật logging trong development mode:
```bash
NODE_ENV=development npm run dev
```

## 📞 HỖ TRỢ

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Database connection
2. Biến môi trường trong file `.env`
3. Port 5000 có bị chiếm không
4. MySQL service đã chạy chưa

## 📄 LICENSE

MIT License