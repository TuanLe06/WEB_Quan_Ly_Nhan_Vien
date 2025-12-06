// src/pages/EmployeeRegister/EmployeeRegister.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeApi } from '../../api/employeeApi';
import { authApi } from '../../api/authApi';
import { Employee } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './EmployeeRegister.css';

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  vai_tro: 'Admin' | 'NhanVien' | 'KeToan';
  ma_nv: string;
}

interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

const EmployeeRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    vai_tro: 'NhanVien',
    ma_nv: ''
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await employeeApi.getAll({ 
        page: 1, 
        limit: 1000
      });
      if (response.success && response.data) {
        // Lọc chỉ lấy nhân viên đang làm việc (trang_thai = 1)
        const activeEmployees = response.data.filter((emp: Employee) => emp.trang_thai === 1);
        setEmployees(activeEmployees);
      }
    } catch (error) {
      console.error('Failed to load employees:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (message.text) setMessage({ type: '', text: '' });
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập tên đăng nhập' });
      return false;
    }

    if (formData.username.length < 3) {
      setMessage({ type: 'error', text: 'Tên đăng nhập phải có ít nhất 3 ký tự' });
      return false;
    }

    if (!formData.password) {
      setMessage({ type: 'error', text: 'Vui lòng nhập mật khẩu' });
      return false;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      return false;
    }

    if (!formData.ma_nv) {
      setMessage({ type: 'error', text: 'Vui lòng chọn nhân viên cần tạo tài khoản' });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authApi.register({
        username: formData.username,
        password: formData.password,
        vai_tro: formData.vai_tro,
        ma_nv: formData.ma_nv
      });

      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: response.message || 'Đăng ký tài khoản thành công!' 
        });
        
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          vai_tro: 'NhanVien',
          ma_nv: ''
        });

        setTimeout(() => {
          navigate('/employees');
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const selectedEmployee = employees.find(emp => emp.ma_nv === formData.ma_nv);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Đăng Ký Tài Khoản</h1>
          <p className="page-subtitle">Tạo tài khoản mới cho nhân viên</p>
        </div>
      </div>

      <div className="register-container">
        <Card>
          <div className="register-form">
            {/* Message Alert */}
            {message.text && (
              <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                <svg 
                  className="alert-icon" 
                  width="20" 
                  height="20" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {message.type === 'success' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <p className="alert-text">{message.text}</p>
              </div>
            )}

            {/* Ma nhan vien */}
            <div className="form-group">
              <label className="form-label">
                Nhân viên <span className="required">*</span>
              </label>
              <select
                name="ma_nv"
                value={formData.ma_nv}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                <option value="">-- Chọn nhân viên cần tạo tài khoản --</option>
                {employees.map(emp => (
                  <option key={emp.ma_nv} value={emp.ma_nv}>
                    {emp.ma_nv} - {emp.ten_nv} ({emp.ten_phong})
                  </option>
                ))}
              </select>
              <p className="form-hint">Tài khoản sẽ được liên kết với nhân viên này</p>
            </div>

            {/* Hiển thị thông tin nhân viên */}
            {selectedEmployee && (
              <div className="employee-info-card">
                <h3 className="info-title">Thông tin nhân viên:</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Mã NV:</span>
                    <span className="info-value">{selectedEmployee.ma_nv}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Họ tên:</span>
                    <span className="info-value">{selectedEmployee.ten_nv}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phòng ban:</span>
                    <span className="info-value">{selectedEmployee.ten_phong}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Chức vụ:</span>
                    <span className="info-value">{selectedEmployee.ten_chuc_vu}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Username */}
            <div className="form-group">
              <label className="form-label">
                Tên đăng nhập <span className="required">*</span>
              </label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập"
                disabled={loading}
              />
              <p className="form-hint">Tối thiểu 3 ký tự, không trùng với tài khoản khác</p>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">
                Mật khẩu <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  <svg className="icon-sm" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
              <p className="form-hint">Tối thiểu 6 ký tự</p>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">
                Xác nhận mật khẩu <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  <svg className="icon-sm" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showConfirmPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Vai tro */}
            <div className="form-group">
              <label className="form-label">
                Vai trò <span className="required">*</span>
              </label>
              <select
                name="vai_tro"
                value={formData.vai_tro}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                <option value="NhanVien">Nhân Viên</option>
                <option value="KeToan">Kế Toán</option>
                <option value="Admin">Admin</option>
              </select>
              <p className="form-hint">
                Quyền hạn: <span className="font-medium">Admin</span> - quản trị toàn bộ, 
                <span className="font-medium"> Kế Toán</span> - quản lý lương/chấm công, 
                <span className="font-medium"> Nhân Viên</span> - xem thông tin cá nhân
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="form-actions">
              <Button
                variant="outline"
                onClick={() => navigate('/employees')}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={loading}
                icon={
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                }
              >
                Đăng ký tài khoản
              </Button>
            </div>
          </div>
        </Card>

        {/* Instructions Card */}
        <Card className="instructions-card">
          <h3 className="instructions-title">Hướng dẫn sử dụng:</h3>
          <ul className="instructions-list">
            <li className="instruction-item">
              <span className="bullet">•</span>
              <span>Chọn nhân viên từ danh sách (chỉ hiển thị nhân viên đang làm việc)</span>
            </li>
            <li className="instruction-item">
              <span className="bullet">•</span>
              <span>Tên đăng nhập phải duy nhất trong hệ thống (tối thiểu 3 ký tự)</span>
            </li>
            <li className="instruction-item">
              <span className="bullet">•</span>
              <span>Mật khẩu nên sử dụng kết hợp chữ, số và ký tự đặc biệt (tối thiểu 6 ký tự)</span>
            </li>
            <li className="instruction-item">
              <span className="bullet">•</span>
              <span>Chọn vai trò phù hợp với chức năng công việc của nhân viên</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeRegister;