import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { departmentApi } from '../../api/departmentApi';
import { Department } from '../../types';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import './Departments.css';

const DepartmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ma_phong: '',
    ten_phong: '',
    nam_thanh_lap: new Date().getFullYear(),
    trang_thai: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      loadDepartment(id);
    }
  }, [id]);

  const loadDepartment = async (ma_phong: string) => {
    try {
      setLoading(true);
      const response = await departmentApi.getById(ma_phong);
      if (response.success && response.data) {
        setFormData({
          ma_phong: response.data.ma_phong,
          ten_phong: response.data.ten_phong,
          nam_thanh_lap: response.data.nam_thanh_lap,
          trang_thai: response.data.trang_thai,
        });
      }
    } catch (error) {
      console.error('Failed to load department:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nam_thanh_lap' || name === 'trang_thai' ? parseInt(value) : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ma_phong.trim()) {
      newErrors.ma_phong = 'Vui lòng nhập mã phòng';
    }
    if (!formData.ten_phong.trim()) {
      newErrors.ten_phong = 'Vui lòng nhập tên phòng ban';
    }
    if (formData.nam_thanh_lap < 1900 || formData.nam_thanh_lap > new Date().getFullYear()) {
      newErrors.nam_thanh_lap = 'Năm thành lập không hợp lệ';
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
        await departmentApi.update(id, formData);
      } else {
        await departmentApi.create(formData);
      }
      navigate('/departments');
    } catch (error: any) {
      console.error('Failed to save department:', error);
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
          {isEdit ? 'Cập nhật phòng ban' : 'Thêm phòng ban mới'}
        </h1>
        <p className="page-subtitle">
          {isEdit ? 'Chỉnh sửa thông tin phòng ban' : 'Điền thông tin phòng ban mới'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="department-form">
          <Input
            label="Mã phòng *"
            name="ma_phong"
            value={formData.ma_phong}
            onChange={handleChange}
            error={errors.ma_phong}
            placeholder="VD: PB001"
            disabled={isEdit}
          />

          <Input
            label="Tên phòng ban *"
            name="ten_phong"
            value={formData.ten_phong}
            onChange={handleChange}
            error={errors.ten_phong}
            placeholder="VD: Phòng Kỹ Thuật"
          />

          <Input
            label="Năm thành lập *"
            type="number"
            name="nam_thanh_lap"
            value={formData.nam_thanh_lap}
            onChange={handleChange}
            error={errors.nam_thanh_lap}
            placeholder="VD: 2020"
          />

          <div className="input-group">
            <label className="input-label">Trạng thái *</label>
            <select
              name="trang_thai"
              value={formData.trang_thai}
              onChange={handleChange}
              className="input"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Không hoạt động</option>
            </select>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/departments')}
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

export default DepartmentForm;