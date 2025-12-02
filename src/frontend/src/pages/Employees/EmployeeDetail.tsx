// src/pages/Employees/EmployeeDetail.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { employeeApi } from '../../api/employeeApi';
import { Employee } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { formatCurrency, formatDate, getStatusText, getGenderText } from '../../utils/formatters';
import './Employees.css';

const EmployeeDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (id) {
      loadEmployee(id);
    }
  }, [id]);

  const loadEmployee = async (ma_nv: string) => {
    try {
      setLoading(true);
      const response = await employeeApi.getById(ma_nv);
      if (response.success && response.data) {
        setEmployee(response.data);
      }
    } catch (error) {
      console.error('Failed to load employee:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullscreen text="Đang tải thông tin..." />;
  }

  if (!employee) {
    return (
      <div className="page-container">
        <Card>
          <p style={{ textAlign: 'center', padding: '40px' }}>
            Không tìm thấy thông tin nhân viên
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Thông tin nhân viên</h1>
          <p className="page-subtitle">Chi tiết thông tin nhân viên {employee.ma_nv}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="outline"
            onClick={() => navigate('/employees')}
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
          >
            Quay lại
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/employees/${employee.ma_nv}/edit`)}
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          >
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <div className="employee-detail">
        <div className="employee-sidebar">
          <Card className="employee-profile">
            <div className="employee-avatar-large">
              {employee.ten_nv.charAt(0).toUpperCase()}
            </div>
            <h2 className="employee-profile-name">{employee.ten_nv}</h2>
            <p className="employee-profile-code">{employee.ma_nv}</p>
            <span className={`employee-profile-status status-badge status-${employee.trang_thai === 1 ? 'active' : 'inactive'}`}>
              {getStatusText(employee.trang_thai === 1 ? 'ACTIVE' : 'INACTIVE')}
            </span>
          </Card>

          <Card title="Thông tin nhanh">
            <div className="employee-quick-info">
              <div className="quick-info-item">
                <div className="quick-info-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="quick-info-content">
                  <div className="quick-info-label">Phòng ban</div>
                  <div className="quick-info-value">{employee.ten_phong || 'Chưa có'}</div>
                </div>
              </div>

              <div className="quick-info-item">
                <div className="quick-info-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="quick-info-content">
                  <div className="quick-info-label">Chức vụ</div>
                  <div className="quick-info-value">{employee.ten_chuc_vu || 'Chưa có'}</div>
                </div>
              </div>

              <div className="quick-info-item">
                <div className="quick-info-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="quick-info-content">
                  <div className="quick-info-label">Lương cơ bản</div>
                  <div className="quick-info-value">{formatCurrency(employee.luong_co_ban)}</div>
                </div>
              </div>

              <div className="quick-info-item">
                <div className="quick-info-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="quick-info-content">
                  <div className="quick-info-label">Thâm niên</div>
                  <div className="quick-info-value">{employee.nam_cong_tac || 0} năm</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="employee-main">
          <Card title="Thông tin cá nhân">
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Mã nhân viên</div>
                <div className="info-value">{employee.ma_nv}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Họ và tên</div>
                <div className="info-value">{employee.ten_nv}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Ngày sinh</div>
                <div className="info-value">{formatDate(employee.ngay_sinh)}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Tuổi</div>
                <div className="info-value">{employee.tuoi || 0} tuổi</div>
              </div>

              <div className="info-item">
                <div className="info-label">Giới tính</div>
                <div className="info-value">{getGenderText(employee.gioi_tinh)}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Trạng thái</div>
                <div className="info-value">
                  <span className={`status-badge status-${employee.trang_thai === 1 ? 'active' : 'inactive'}`}>
                    {getStatusText(employee.trang_thai === 1 ? 'ACTIVE' : 'INACTIVE')}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Thông tin công việc">
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Phòng ban</div>
                <div className="info-value">{employee.ten_phong || 'Chưa có'}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Mã phòng ban</div>
                <div className="info-value">{employee.ma_phong}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Chức vụ</div>
                <div className="info-value">{employee.ten_chuc_vu || 'Chưa có'}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Mã chức vụ</div>
                <div className="info-value">{employee.ma_chucvu}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Ngày vào làm</div>
                <div className="info-value">{formatDate(employee.ngay_vao_lam)}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Số năm công tác</div>
                <div className="info-value">{employee.nam_cong_tac || 0} năm</div>
              </div>
            </div>
          </Card>

          <Card title="Thông tin lương">
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Lương cơ bản</div>
                <div className="info-value" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>
                  {formatCurrency(employee.luong_co_ban)}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;