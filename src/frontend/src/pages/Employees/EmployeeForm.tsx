// src/pages/Employees/EmployeeForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { employeeApi } from '../../api/employeeApi';
import { departmentApi } from '../../api/departmentApi';
import { positionApi } from '../../api/positionApi';
import { EmployeeFormData, Department, Position } from '../../types';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import './Employees.css';

const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [formData, setFormData] = useState<EmployeeFormData>({
    ten_nv: '',
    ngay_sinh: '',
    gioi_tinh: 'Nam',
    ma_phong: '',
    ma_chucvu: '',
    luong_co_ban: 0,
    ngay_vao_lam: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadMasterData();
    if (isEdit && id) {
      loadEmployee(id);
    }
  }, [id]);

  const loadMasterData = async () => {
    try {
      const [deptRes, posRes] = await Promise.all([
        departmentApi.getAll(),
        positionApi.getAll(),
      ]);

      if (deptRes.success && deptRes.data) {
        setDepartments(deptRes.data);
      }
      if (posRes.success && posRes.data) {
        setPositions(posRes.data);
      }
    } catch (error) {
      console.error('Failed to load master data:', error);
    }
  };

  const loadEmployee = async (ma_nv: string) => {
    try {
      setLoading(true);
      const response = await employeeApi.getById(ma_nv);
      if (response.success && response.data) {
        const emp = response.data;
        setFormData({
          ten_nv: emp.ten_nv,
          ngay_sinh: emp.ngay_sinh.split('T')[0],
          gioi_tinh: emp.gioi_tinh,
          ma_phong: emp.ma_phong,
          ma_chucvu: emp.ma_chucvu,
          luong_co_ban: emp.luong_co_ban,
          ngay_vao_lam: emp.ngay_vao_lam.split('T')[0],
        });
      }
    } catch (error) {
      console.error('Failed to load employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'luong_co_ban' ? parseFloat(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ten_nv.trim()) {
      newErrors.ten_nv = 'Vui lòng nhập tên nhân viên';
    }
    if (!formData.ngay_sinh) {
      newErrors.ngay_sinh = 'Vui lòng chọn ngày sinh';
    }
    if (!formData.ma_phong) {
      newErrors.ma_phong = 'Vui lòng chọn phòng ban';
    }
    if (!formData.ma_chucvu) {
      newErrors.ma_chucvu = 'Vui lòng chọn chức vụ';
    }
    if (!formData.ngay_vao_lam) {
      newErrors.ngay_vao_lam = 'Vui lòng chọn ngày vào làm';
    }
    if (formData.luong_co_ban <= 0) {
      newErrors.luong_co_ban = 'Lương cơ bản phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      if (isEdit && id) {
        await employeeApi.update(id, formData);
      } else {
        await employeeApi.create(formData);
      }
      navigate('/employees');
    } catch (error: any) {
      console.error('Failed to save employee:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <Loading fullscreen text="Đang tải thông tin..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          {isEdit ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
        </h1>
        <p className="page-subtitle">
          {isEdit ? 'Chỉnh sửa thông tin nhân viên' : 'Điền thông tin nhân viên mới'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-section">
            <div className="form-section-title">
              <div className="form-section-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Thông tin cá nhân
            </div>

            <Input
              label="Họ và tên *"
              name="ten_nv"
              value={formData.ten_nv}
              onChange={handleChange}
              error={errors.ten_nv}
              placeholder="Nhập họ và tên"
            />

            <Input
              label="Ngày sinh *"
              type="date"
              name="ngay_sinh"
              value={formData.ngay_sinh}
              onChange={handleChange}
              error={errors.ngay_sinh}
            />

            <div className="input-group">
              <label className="input-label">Giới tính *</label>
              <select
                name="gioi_tinh"
                value={formData.gioi_tinh}
                onChange={handleChange}
                className="input"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <Input
              label="Ngày vào làm *"
              type="date"
              name="ngay_vao_lam"
              value={formData.ngay_vao_lam}
              onChange={handleChange}
              error={errors.ngay_vao_lam}
            />
          </div>

          <div className="form-section">
            <div className="form-section-title">
              <div className="form-section-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              Thông tin công việc
            </div>

            <div className="input-group">
              <label className="input-label">Phòng ban *</label>
              <select
                name="ma_phong"
                value={formData.ma_phong}
                onChange={handleChange}
                className={`input ${errors.ma_phong ? 'input-error' : ''}`}
              >
                <option value="">-- Chọn phòng ban --</option>
                {departments.map(dept => (
                  <option key={dept.ma_phong} value={dept.ma_phong}>
                    {dept.ten_phong}
                  </option>
                ))}
              </select>
              {errors.ma_phong && <span className="input-error-text">{errors.ma_phong}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">Chức vụ *</label>
              <select
                name="ma_chucvu"
                value={formData.ma_chucvu}
                onChange={handleChange}
                className={`input ${errors.ma_chucvu ? 'input-error' : ''}`}
              >
                <option value="">-- Chọn chức vụ --</option>
                {positions.map(pos => (
                  <option key={pos.ma_chuc_vu} value={pos.ma_chuc_vu}>
                    {pos.ten_chuc_vu}
                  </option>
                ))}
              </select>
              {errors.ma_chucvu && <span className="input-error-text">{errors.ma_chucvu}</span>}
            </div>

            <Input
              label="Lương cơ bản (VNĐ) *"
              type="number"
              name="luong_co_ban"
              value={formData.luong_co_ban}
              onChange={handleChange}
              error={errors.luong_co_ban}
              placeholder="Nhập lương cơ bản"
            />
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/employees')}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EmployeeForm;