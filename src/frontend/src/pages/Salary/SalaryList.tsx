import React, { useState, useEffect } from 'react';
import { salaryApi } from '../../api/salaryApi';
import { Salary } from '../../types';
import Table from '../../components/common/Table';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './Salary.css';

const SalaryList: React.FC = () => {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadSalaries();
  }, [selectedMonth, selectedYear]);

  const loadSalaries = async () => {
    try {
      setLoading(true);
      const response = await salaryApi.getMonthly(selectedMonth, selectedYear);
      if (response.success && response.data) {
        setSalaries(response.data);
      }
    } catch (error) {
      console.error('Failed to load salaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateAll = async () => {
    if (window.confirm(`Tính lương tháng ${selectedMonth}/${selectedYear} cho tất cả nhân viên?`)) {
      try {
        setLoading(true);
        await salaryApi.calculateAll(selectedMonth, selectedYear);
        loadSalaries();
      } catch (error) {
        console.error('Failed to calculate salaries:', error);
      } finally {
        setLoading(false);
      }
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
      key: 'tong_gio',
      title: 'Tổng giờ',
      width: '100px',
      align: 'center' as const,
      render: (value: number) => `${value}h`,
    },
    {
      key: 'luong_co_ban',
      title: 'Lương cơ bản',
      width: '150px',
      align: 'right' as const,
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'luong_them',
      title: 'Lương thêm',
      width: '150px',
      align: 'right' as const,
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'luong_thuc_nhan',
      title: 'Thực nhận',
      width: '150px',
      align: 'right' as const,
      render: (value: number) => (
        <strong style={{ color: 'var(--primary)' }}>{formatCurrency(value)}</strong>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý lương</h1>
          <p className="page-subtitle">Bảng lương nhân viên</p>
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

          <Button
            variant="primary"
            onClick={handleCalculateAll}
            disabled={loading}
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          >
            Tính lương tháng này
          </Button>
        </div>

        <Table
          columns={columns}
          data={salaries}
          loading={loading}
          rowKey="id"
          emptyText="Chưa có dữ liệu lương"
        />
      </Card>
    </div>
  );
};

export default SalaryList;