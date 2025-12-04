import React, { useState, useEffect } from 'react';
import { salaryApi } from '../../api/salaryApi';
import Table from '../../components/common/Table';
import Card from '../../components/common/Card';
import { formatCurrency } from '../../utils/formatters';
import './Salary.css';

const SalaryDeductedList: React.FC = () => {
  const [salaries, setSalaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalDeduction, setTotalDeduction] = useState(0);

  useEffect(() => {
    loadDeductedSalaries();
  }, [selectedMonth, selectedYear]);

  const loadDeductedSalaries = async () => {
    try {
      setLoading(true);
      const response = await salaryApi.getDeducted(selectedMonth, selectedYear);
      if (response.success && response.data) {
        setSalaries(response.data);
        setTotalDeduction((response as any).tongTruLuong || 0);
      }
    } catch (error) {
      console.error('Failed to load deducted salaries:', error);
      setSalaries([]);
      setTotalDeduction(0);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'ma_nv',
      title: 'Mã NV',
      width: '100px',
    },
    {
      key: 'ten_nv',
      title: 'Họ tên',
    },
    {
      key: 'ten_phong',
      title: 'Phòng ban',
      width: '150px',
    },
    {
      key: 'ten_chuc_vu',
      title: 'Chức vụ',
      width: '120px',
    },
    {
      key: 'tong_gio',
      title: 'Giờ làm',
      width: '100px',
      align: 'center' as const,
      render: (value: number) => (
        <span className="salary-hours-cell low">
          {value}h / 40h
        </span>
      ),
    },
    {
      key: 'gio_thieu',
      title: 'Giờ thiếu',
      width: '100px',
      align: 'center' as const,
      render: (value: number) => (
        <span className="salary-badge danger">
          -{value}h
        </span>
      ),
    },
    {
      key: 'luong_co_ban',
      title: 'Lương cơ bản',
      width: '150px',
      align: 'right' as const,
      render: (value: number) => (
        <span className="salary-amount-cell base">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'tru_luong',
      title: 'Số tiền trừ',
      width: '150px',
      align: 'right' as const,
      render: (value: number) => (
        <strong className="salary-amount-cell deduction">
          -{formatCurrency(value)}
        </strong>
      ),
    },
    {
      key: 'luong_thuc_nhan',
      title: 'Thực nhận',
      width: '150px',
      align: 'right' as const,
      render: (value: number) => (
        <strong className="salary-amount-cell total">{formatCurrency(value)}</strong>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nhân viên bị trừ lương</h1>
          <p className="page-subtitle">
            Danh sách nhân viên làm thiếu giờ tháng {selectedMonth}/{selectedYear}
          </p>
        </div>
      </div>

      <Card>
        <div className="salary-toolbar">
          <div className="salary-filters">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="input"
              style={{ width: '120px' }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>Tháng {month}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="input"
              style={{ width: '120px' }}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {!loading && salaries.length > 0 && (
          <div className="salary-stats-grid">
            <div className="salary-stat-card danger">
              <div className="salary-stat-label">Số nhân viên bị trừ</div>
              <div className="salary-stat-value danger">{salaries.length}</div>
            </div>

            <div className="salary-stat-card danger">
              <div className="salary-stat-label">Tổng số tiền trừ</div>
              <div className="salary-stat-value danger">{formatCurrency(totalDeduction)}</div>
            </div>

            <div className="salary-stat-card warning">
              <div className="salary-stat-label">Trung bình trừ/người</div>
              <div className="salary-stat-value warning">
                {formatCurrency(totalDeduction / salaries.length)}
              </div>
            </div>
          </div>
        )}

        {!loading && salaries.length === 0 && (
          <div className="salary-empty-state">
            <div className="salary-alert-icon">✓</div>
            <div className="salary-alert-title">Xuất sắc!</div>
            <div style={{ color: '#64748b' }}>
              Tất cả nhân viên đều làm đủ giờ trong tháng này
            </div>
          </div>
        )}

        <Table
          columns={columns}
          data={salaries}
          loading={loading}
          rowKey="ma_nv"
          emptyText="Không có nhân viên bị trừ lương"
        />

        {salaries.length > 0 && (
          <div className="salary-note">
            <strong>Lưu ý:</strong> Lương bị trừ khi nhân viên làm thiếu so với 40 giờ chuẩn/tháng. 
            Công thức: <code>Tiền trừ = (Giờ thiếu / 40) × Lương cơ bản</code>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SalaryDeductedList;