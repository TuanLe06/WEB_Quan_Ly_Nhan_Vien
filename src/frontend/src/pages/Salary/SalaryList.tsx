import React, { useState, useEffect } from 'react';
import { salaryApi } from '../../api/salaryApi';
import { Salary } from '../../types';
import Table from '../../components/common/Table';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';
import './Salary.css';

const SalaryList: React.FC = () => {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalSalary, setTotalSalary] = useState(0);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [deductedCount, setDeductedCount] = useState(0);

  useEffect(() => {
    loadSalaries();
  }, [selectedMonth, selectedYear]);

  const loadSalaries = async () => {
    try {
      setLoading(true);
      const response = await salaryApi.getMonthly(selectedMonth, selectedYear);
      if (response.success && response.data) {
        setSalaries(response.data);
        const total = (response as any).tongLuong || 
                      response.data.reduce((sum, item) => sum + parseFloat(String(item.luong_thuc_nhan)), 0);
        const deduction = (response as any).tongTruLuong || 0;
        const deductedCount = (response as any).soNVBiTru || 0;
        
        setTotalSalary(total);
        setTotalDeduction(deduction);
        setDeductedCount(deductedCount);
      }
    } catch (error) {
      console.error('Failed to load salaries:', error);
      setSalaries([]);
      setTotalSalary(0);
      setTotalDeduction(0);
      setDeductedCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateAll = async () => {
    if (window.confirm(`Tính lương tháng ${selectedMonth}/${selectedYear} cho tất cả nhân viên?`)) {
      try {
        setCalculating(true);
        const response = await salaryApi.calculateAll(selectedMonth, selectedYear);
        
        if (response.success) {
          const result = (response as any).data;
          alert(
            `Tính lương hoàn tất!\n` +
            `Tổng số: ${result.total} nhân viên\n` +
            `Thành công: ${result.success}\n` +
            `Lỗi: ${result.error}`
          );
          loadSalaries();
        }
      } catch (error: any) {
        console.error('Failed to calculate salaries:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi tính lương');
      } finally {
        setCalculating(false);
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
      width: '180px',
    },
    {
      key: 'ten_phong',
      title: 'Phòng ban',
      width: '130px',
    },
    {
      key: 'ten_chuc_vu',
      title: 'Chức vụ',
      width: '110px',
    },
    {
      key: 'tong_gio',
      title: 'Giờ làm',
      width: '90px',
      align: 'center' as const,
      render: (value: number) => {
        const isLow = value < 40;
        const isOver = value > 40;
        const className = isLow ? 'low' : isOver ? 'over' : 'normal';
        
        return (
          <span className={`salary-hours-cell ${className}`}>
            {value}h
            {isLow && <span className="salary-hours-detail">/ 40h</span>}
            {isOver && <span className="salary-hours-detail">+{value - 40}h</span>}
          </span>
        );
      },
    },
    {
      key: 'luong_co_ban',
      title: 'Lương CB',
      width: '130px',
      align: 'right' as const,
      render: (value: number) => (
        <span className="salary-amount-cell base">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'luong_them',
      title: 'Lương thêm',
      width: '130px',
      align: 'right' as const,
      render: (value: number) => (
        <span className={`salary-amount-cell ${value > 0 ? 'bonus' : 'muted'}`}>
          {value > 0 ? '+' : ''}{formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'tru_luong',
      title: 'Trừ lương',
      width: '130px',
      align: 'right' as const,
      render: (value: number) => {
        const truLuong = value || 0;
        return (
          <span className={`salary-amount-cell ${truLuong > 0 ? 'deduction' : 'muted'}`}>
            {truLuong > 0 ? '-' : ''}{formatCurrency(truLuong)}
          </span>
        );
      },
    },
    {
      key: 'luong_thuc_nhan',
      title: 'Thực nhận',
      width: '150px',
      align: 'right' as const,
      render: (value: number) => (
        <strong className="salary-amount-cell total">
          {formatCurrency(value)}
        </strong>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý lương</h1>
          <p className="page-subtitle">
            Bảng lương nhân viên tháng {selectedMonth}/{selectedYear}
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

          <Button
            variant="primary"
            onClick={handleCalculateAll}
            disabled={loading || calculating}
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          >
            {calculating ? 'Đang tính...' : 'Tính lương tháng này'}
          </Button>
        </div>

        {!loading && salaries.length > 0 && (
          <div className="salary-stats-grid">
            <div className="salary-stat-card info">
              <div className="salary-stat-label">Tổng số nhân viên</div>
              <div className="salary-stat-value info">{salaries.length}</div>
            </div>

            <div className="salary-stat-card success">
              <div className="salary-stat-label">Tổng quỹ lương</div>
              <div className="salary-stat-value success">{formatCurrency(totalSalary)}</div>
            </div>

            {totalDeduction > 0 && (
              <div className="salary-stat-card danger">
                <div className="salary-stat-label">
                  Tổng trừ lương ({deductedCount} NV)
                </div>
                <div className="salary-stat-value danger">{formatCurrency(totalDeduction)}</div>
              </div>
            )}
          </div>
        )}

        {!loading && totalDeduction > 0 && (
          <div className="salary-alert">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <strong>Cảnh báo:</strong> Có {deductedCount} nhân viên làm thiếu giờ trong tháng này. 
              Tổng số tiền bị trừ: <strong>{formatCurrency(totalDeduction)}</strong>
            </div>
          </div>
        )}

        <Table
          columns={columns}
          data={salaries}
          loading={loading}
          rowKey="id"
          emptyText="Chưa có dữ liệu lương"
        />

        {salaries.length > 0 && (
          <div className="salary-note">
            <strong>Ghi chú:</strong> Giờ chuẩn: 40h/tháng • 
            Làm thiếu giờ: trừ lương theo tỷ lệ • 
            Làm thêm giờ: tính hệ số 1.5
          </div>
        )}
      </Card>
    </div>
  );
};

export default SalaryList;