import React, { useState, useEffect } from 'react';
import { salaryApi } from '../../api/salaryApi';
import { Salary } from '../../types';
import Table from '../../components/common/Table';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import './Salary.css';

const SalaryList: React.FC = () => {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalSalary, setTotalSalary] = useState(0);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [deductedCount, setDeductedCount] = useState(0);
  const [statusCount, setStatusCount] = useState({ 
    'Bản nháp': 0, 
    'Đã xác nhận': 0, 
    'Đã khóa': 0 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSalaries, setFilteredSalaries] = useState<Salary[]>([]);
  
  const isAdmin = user?.vai_tro === 'Admin';
  const isKeToan = user?.vai_tro === 'KeToan';
  const canManage = isAdmin || isKeToan;

  useEffect(() => {
    loadSalaries();
  }, [selectedMonth, selectedYear]);

  // Filter salaries based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSalaries(salaries);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = salaries.filter(salary => 
      salary.ma_nv.toLowerCase().includes(term) ||
      salary.ten_nv.toLowerCase().includes(term)
    );
    setFilteredSalaries(filtered);
  }, [searchTerm, salaries]);

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
        
        // ✅ FIX: Khớp với BE response - dùng tiếng Việt
        setStatusCount((response as any).statusCount || { 
          'Bản nháp': 0, 
          'Đã xác nhận': 0, 
          'Đã khóa': 0 
        });
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

  const handleCalculateAll = async (force: boolean = false) => {
    const hasLockedRecords = statusCount['Đã khóa'] > 0;
    
    if (!force && hasLockedRecords && !isAdmin) {
      alert('Có bản ghi lương đã bị khóa. Chỉ Admin mới có thể tính lại.');
      return;
    }

    const confirmMsg = force 
      ? `BẠN ĐANG TÍNH LẠI LƯƠNG ĐÃ KHÓA!\n\nCó ${statusCount['Đã khóa']} bản ghi đã khóa sẽ được tính lại.\nBạn có chắc chắn muốn tiếp tục?`
      : `Tính lương tháng ${selectedMonth}/${selectedYear} cho tất cả nhân viên?`;

    if (window.confirm(confirmMsg)) {
      try {
        setCalculating(true);
        const response = await salaryApi.calculateAll(selectedMonth, selectedYear, force);
        
        if (response.success) {
          const result = (response as any).data;
          let message = `Tính lương hoàn tất!\n` +
                       `Tổng số: ${result.total} nhân viên\n` +
                       `Thành công: ${result.success}\n`;
          
          if (result.skipped > 0) {
            message += `Bỏ qua (đã khóa): ${result.skipped}\n`;
          }
          if (result.error > 0) {
            message += `Lỗi: ${result.error}`;
          }
          
          alert(message);
          loadSalaries();
        }
      } catch (error: any) {
        console.error('Failed to calculate salaries:', error);
        
        // Xử lý lỗi needConfirm
        if (error.response?.data?.needConfirm && isAdmin) {
          if (window.confirm(`${error.response.data.message}\n\nBạn có muốn FORCE tính lại?`)) {
            handleCalculateAll(true);
          }
        } else {
          alert(error.response?.data?.message || 'Có lỗi xảy ra khi tính lương');
        }
      } finally {
        setCalculating(false);
      }
    }
  };

  const handleLockMonth = async () => {
    if (statusCount['Đã khóa'] > 0) {
      alert('Lương tháng này đã bị khóa!');
      return;
    }

    const ghi_chu = prompt('Nhập ghi chú (không bắt buộc):');
    if (ghi_chu === null) return; // User cancelled

    try {
      const response = await salaryApi.lock(selectedMonth, selectedYear, ghi_chu || undefined);
      if (response.success) {
        alert(`Đã khóa lương tháng ${selectedMonth}/${selectedYear}`);
        loadSalaries();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi khóa lương');
    }
  };

  const handleUnlockMonth = async () => {
    if (!isAdmin) {
      alert('Chỉ Admin mới có thể mở khóa lương!');
      return;
    }

    const ly_do = prompt('CẢNH BÁO: Bạn đang mở khóa lương đã chốt!\n\nVui lòng nhập lý do mở khóa:');
    if (!ly_do || ly_do.trim() === '') {
      alert('Vui lòng nhập lý do!');
      return;
    }

    try {
      const response = await salaryApi.unlock(selectedMonth, selectedYear, ly_do);
      if (response.success) {
        alert(`Đã mở khóa lương tháng ${selectedMonth}/${selectedYear}`);
        loadSalaries();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi mở khóa lương');
    }
  };

  const handleConfirmMonth = async () => {
    if (statusCount['Đã xác nhận'] > 0 || statusCount['Đã khóa'] > 0) {
      alert('Lương tháng này đã được xác nhận hoặc khóa!');
      return;
    }

    if (window.confirm(`Xác nhận lương tháng ${selectedMonth}/${selectedYear}?\n\nSau khi xác nhận, chỉ Admin/Kế toán mới có thể sửa.`)) {
      try {
        const response = await salaryApi.confirm(selectedMonth, selectedYear);
        if (response.success) {
          alert(`Đã xác nhận lương tháng ${selectedMonth}/${selectedYear}`);
          loadSalaries();
        }
      } catch (error: any) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xác nhận lương');
      }
    }
  };

  // ✅ FIX: Helper function để lấy status badge
  const getStatusBadge = (status?: string) => {
    const statusMap = {
      'Bản nháp': { text: 'Nháp', class: 'warning' },
      'Đã xác nhận': { text: 'Đã duyệt', class: 'success' },
      'Đã khóa': { text: 'Đã khóa', class: 'danger' }
    };
    const badge = statusMap[status as keyof typeof statusMap] || statusMap['Bản nháp'];
    return <span className={`salary-badge ${badge.class}`}>{badge.text}</span>;
  };

  // ✅ FIX: Determine month status
  const monthStatus = statusCount['Đã khóa'] > 0 
    ? 'Đã khóa' 
    : statusCount['Đã xác nhận'] > 0 
      ? 'Đã xác nhận' 
      : 'Bản nháp';

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
        <span className="salary-amount-cell base">{formatCurrency(value || 0)}</span>
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
      render: (value: number) => (
        <span className={`salary-amount-cell ${value > 0 ? 'deduction' : 'muted'}`}>
          {value > 0 ? '-' : ''}{formatCurrency(value)}
        </span>
      ),
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
    {
      key: 'trang_thai',
      title: 'Trạng thái',
      width: '100px',
      align: 'center' as const,
      render: (value?: string) => getStatusBadge(value),
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

            <div className="salary-search-box">
              <svg 
                className="salary-search-icon" 
                width="16" 
                height="16" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <input
                type="text"
                placeholder="Tìm theo mã NV hoặc tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input salary-search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="salary-search-clear"
                  title="Xóa tìm kiếm"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path 
                      fillRule="evenodd" 
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {canManage && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {monthStatus === 'Bản nháp' && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => handleCalculateAll(false)}
                    disabled={loading || calculating}
                    icon={
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    }
                  >
                    {calculating ? 'Đang tính...' : 'Tính lương tháng này'}
                  </Button>

                  <Button
                    variant="success"
                    onClick={handleConfirmMonth}
                    disabled={loading || salaries.length === 0}
                  >
                    Xác nhận
                  </Button>
                </>
              )}

              {monthStatus === 'Đã xác nhận' && (
                <Button
                  variant="danger"
                  onClick={handleLockMonth}
                  disabled={loading}
                >
                  🔒 Khóa lương
                </Button>
              )}

              {monthStatus === 'Đã khóa' && isAdmin && (
                <>
                  <Button
                    variant="danger"
                    onClick={handleUnlockMonth}
                    disabled={loading}
                  >
                    🔓 Mở khóa
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleCalculateAll(true)}
                    disabled={loading || calculating}
                  >
                    {calculating ? 'Đang tính...' : '⚠️ Tính lại (Force)'}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {!loading && salaries.length > 0 && (
          <div className="salary-stats-grid">
            <div className="salary-stat-card info">
              <div className="salary-stat-label">Tổng số nhân viên</div>
              <div className="salary-stat-value info">
                {salaries.length}
                {searchTerm && filteredSalaries.length !== salaries.length && (
                  <span className="salary-search-count">
                    ({filteredSalaries.length} kết quả)
                  </span>
                )}
              </div>
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

            <div className="salary-stat-card warning">
              <div className="salary-stat-label">Trạng thái tháng</div>
              <div className="salary-stat-value warning">
                {getStatusBadge(monthStatus)}
              </div>
            </div>
          </div>
        )}

        {monthStatus === 'Đã khóa' && (
          <div className="salary-alert success">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <div>
              <strong>Đã khóa:</strong> Lương tháng này đã được chốt số. 
              {isAdmin ? ' Admin có thể mở khóa để chỉnh sửa.' : ' Liên hệ Admin để chỉnh sửa.'}
            </div>
          </div>
        )}

        {!loading && totalDeduction > 0 && monthStatus !== 'Đã khóa' && (
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
          data={filteredSalaries}
          loading={loading}
          rowKey="id"
          emptyText={searchTerm ? `Không tìm thấy kết quả cho "${searchTerm}"` : "Chưa có dữ liệu lương"}
        />

        {salaries.length > 0 && (
          <div className="salary-note">
            <strong>Ghi chú:</strong> Giờ chuẩn: 40h/tháng • 
            Làm thiếu giờ: trừ lương theo tỷ lệ • 
            Làm thêm giờ: tính hệ số 1.5 • 
            Trạng thái: {getStatusBadge('Bản nháp')} → {getStatusBadge('Đã xác nhận')} → {getStatusBadge('Đã khóa')}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SalaryList;