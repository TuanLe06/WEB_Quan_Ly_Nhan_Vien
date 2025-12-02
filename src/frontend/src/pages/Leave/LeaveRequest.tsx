import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveApi } from '../../api/leaveApi';
import { useAuth } from '../../hooks/useAuth';
import { LeaveFormData } from '../../types';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import './Leave.css';

const LeaveRequest: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LeaveFormData>({
    ma_nv: user?.ma_nv ? user.ma_nv : '',
    ngay_bat_dau: '',
    ngay_ket_thuc: '',
    loai_phep: 'Phép năm',
    ly_do: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ngay_bat_dau) newErrors.ngay_bat_dau = 'Vui lòng chọn ngày bắt đầu';
    if (!formData.ngay_ket_thuc) newErrors.ngay_ket_thuc = 'Vui lòng chọn ngày kết thúc';
    if (!formData.ly_do.trim()) newErrors.ly_do = 'Vui lòng nhập lý do';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      await leaveApi.create(formData);
      navigate('/leave');
    } catch (error: any) {
      console.error('Failed to create leave:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Đăng ký nghỉ phép</h1>
        <p className="page-subtitle">Gửi yêu cầu nghỉ phép</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="leave-form">
          <div className="input-group">
            <label className="input-label">Loại phép *</label>
            <select
              name="loai_phep"
              value={formData.loai_phep}
              onChange={handleChange}
              className="input"
            >
              <option value="Phép năm">Phép năm</option>
              <option value="Phép ốm">Phép ốm</option>
              <option value="Phép thai sản">Phép thai sản</option>
              <option value="Phép không lương">Phép không lương</option>
            </select>
          </div>

          <Input
            label="Từ ngày *"
            type="date"
            name="ngay_bat_dau"
            value={formData.ngay_bat_dau}
            onChange={handleChange}
            error={errors.ngay_bat_dau}
          />

          <Input
            label="Đến ngày *"
            type="date"
            name="ngay_ket_thuc"
            value={formData.ngay_ket_thuc}
            onChange={handleChange}
            error={errors.ngay_ket_thuc}
          />

          <div className="input-group form-full-width">
            <label className="input-label">Lý do *</label>
            <textarea
              name="ly_do"
              value={formData.ly_do}
              onChange={handleChange}
              className={`input ${errors.ly_do ? 'input-error' : ''}`}
              rows={4}
              placeholder="Nhập lý do nghỉ phép"
            />
            {errors.ly_do && <span className="input-error-text">{errors.ly_do}</span>}
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/leave')}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Gửi yêu cầu
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LeaveRequest;