import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { contractApi } from '../../api/contractApi';
import { employeeApi } from '../../api/employeeApi';
import { Employee } from '../../types';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import './Contracts.css';

const ContractForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    ma_nv: '',
    loai_hop_dong: 'Toàn thời gian',
    ngay_bat_dau: '',
    ngay_ket_thuc: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load danh sách nhân viên và contract nếu là edit
  useEffect(() => {
    loadEmployees();
    if (isEdit && id) {
      loadContract(parseInt(id));
    }
  }, [id]);

  const loadEmployees = async () => {
    try {
      const response = await employeeApi.getAll({ page: 1, limit: 1000 });
      if (response.success && response.data) {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error('Failed to load employees:', error);
    }
  };

  const loadContract = async (contractId: number) => {
    try {
      setLoading(true);
      const response = await contractApi.getById(contractId);
      if (response.success && response.data) {
        const contract = response.data;
        setFormData({
          ma_nv: contract.ma_nv,
          loai_hop_dong: contract.loai_hop_dong,
          ngay_bat_dau: contract.ngay_bat_dau.split('T')[0],
          ngay_ket_thuc: contract.ngay_ket_thuc ? contract.ngay_ket_thuc.split('T')[0] : '',
        });
      }
    } catch (error) {
      console.error('Failed to load contract:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.ma_nv) newErrors.ma_nv = 'Vui lòng chọn nhân viên';
    if (!formData.ngay_bat_dau) newErrors.ngay_bat_dau = 'Vui lòng chọn ngày bắt đầu';
    
    // Validate ngày kết thúc phải sau ngày bắt đầu
    if (formData.ngay_ket_thuc && formData.ngay_bat_dau) {
      if (new Date(formData.ngay_ket_thuc) < new Date(formData.ngay_bat_dau)) {
        newErrors.ngay_ket_thuc = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('ma_nv', formData.ma_nv);
      formDataToSend.append('loai_hop_dong', formData.loai_hop_dong);
      formDataToSend.append('ngay_bat_dau', formData.ngay_bat_dau);
      
      // Chỉ append ngay_ket_thuc nếu có giá trị
      if (formData.ngay_ket_thuc) {
        formDataToSend.append('ngay_ket_thuc', formData.ngay_ket_thuc);
      }
      
      // CHỈ append file nếu thực sự có file được chọn
      if (file) {
        formDataToSend.append('file_hop_dong', file);
      }

      // Debug: Log FormData contents
      console.log('Sending FormData:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      if (isEdit && id) {
        await contractApi.update(parseInt(id), formDataToSend);
        alert('Cập nhật hợp đồng thành công!');
      } else {
        await contractApi.create(formDataToSend);
        alert('Thêm hợp đồng thành công!');
      }

      navigate('/contracts');
    } catch (error: any) {
      console.error('Failed to save contract:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra!';
      alert(`Lỗi: ${errorMessage}\n\nChi tiết: ${JSON.stringify(error.response?.data)}`);
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
        <h1 className="page-title">{isEdit ? 'Cập nhật hợp đồng' : 'Thêm hợp đồng mới'}</h1>
        <p className="page-subtitle">
          {isEdit ? 'Chỉnh sửa thông tin hợp đồng' : 'Điền thông tin hợp đồng mới'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="contract-form">
          <div className="input-group">
            <label className="input-label">Nhân viên *</label>
            <select
              name="ma_nv"
              value={formData.ma_nv}
              onChange={handleChange}
              className={`input ${errors.ma_nv ? 'input-error' : ''}`}
              disabled={isEdit}
            >
              <option value="">-- Chọn nhân viên --</option>
              {employees.map(emp => (
                <option key={emp.ma_nv} value={emp.ma_nv}>
                  {emp.ma_nv} - {emp.ten_nv}
                </option>
              ))}
            </select>
            {errors.ma_nv && <span className="input-error-text">{errors.ma_nv}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">Loại hợp đồng *</label>
            <select
              name="loai_hop_dong"
              value={formData.loai_hop_dong}
              onChange={handleChange}
              className="input"
            >
              <option value="Toàn thời gian">Toàn thời gian</option>
              <option value="Bán thời gian">Bán thời gian</option>
              <option value="Thử việc">Thử việc</option>
              <option value="Thực tập">Thực tập</option>
            </select>
          </div>

          <Input
            label="Ngày bắt đầu *"
            type="date"
            name="ngay_bat_dau"
            value={formData.ngay_bat_dau}
            onChange={handleChange}
            error={errors.ngay_bat_dau}
          />

          <Input
            label="Ngày kết thúc"
            type="date"
            name="ngay_ket_thuc"
            value={formData.ngay_ket_thuc}
            onChange={handleChange}
            error={errors.ngay_ket_thuc}
            helperText="Để trống nếu hợp đồng không xác định thời hạn"
          />

          <div className="input-group form-full-width">
            <label className="input-label">File hợp đồng (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="input"
            />
            {file && <span className="input-helper-text">Đã chọn: {file.name}</span>}
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/contracts')}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ContractForm;