import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { Attendance } from '../../types';
import Table from '../../components/common/Table';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatTime } from '../../utils/formatters';
import './Attendance.css';

const AttendanceList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'today' | 'late' | 'notchecked' | 'stats'>('today');
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [lateEmployees, setLateEmployees] = useState<any[]>([]);
  const [notCheckedOut, setNotCheckedOut] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Load counts for all tabs on mount
  useEffect(() => {
    loadAllCounts();
  }, []);

  // Load data when tab or filters change
  useEffect(() => {
    loadData();
  }, [activeTab, selectedMonth, selectedYear]);

  const loadAllCounts = async () => {
    try {
      // Load counts for badge display
      const [todayRes, lateRes, notCheckedRes] = await Promise.all([
        attendanceApi.getToday(),
        attendanceApi.getLate(),
        attendanceApi.getNotCheckedOut(),
      ]);

      if (todayRes.success && todayRes.data) {
        setAttendances(todayRes.data);
      }
      if (lateRes.success && lateRes.data) {
        setLateEmployees(lateRes.data);
      }
      if (notCheckedRes.success && notCheckedRes.data) {
        setNotCheckedOut(notCheckedRes.data);
      }
    } catch (error) {
      console.error('Failed to load counts:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'today') {
        const response = await attendanceApi.getToday();
        if (response.success && response.data) {
          setAttendances(response.data);
        }
      } else if (activeTab === 'late') {
        const response = await attendanceApi.getLate({
          thang: selectedMonth,
          nam: selectedYear
        });
        if (response.success && response.data) {
          setLateEmployees(response.data);
        }
      } else if (activeTab === 'notchecked') {
        const response = await attendanceApi.getNotCheckedOut();
        if (response.success && response.data) {
          setNotCheckedOut(response.data);
        }
      } else if (activeTab === 'stats') {
        const response = await attendanceApi.getStats({
          thang: selectedMonth,
          nam: selectedYear
        });
        if (response.success && response.data) {
          setMonthlyStats(response.data);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Normalize status text to handle different encodings
  const normalizeStatus = (status: string): string => {
    if (!status) return '';
    // Handle both UTF-8 encoded and regular Vietnamese text
    const normalized = status.trim().toLowerCase();
    if (normalized.includes('mu') || normalized === 'muộn') return 'Muộn';
    if (normalized.includes('ng gi') || normalized === 'đúng giờ') return 'Đúng giờ';
    if (normalized.includes('ch') || normalized === 'đủ giờ') return 'Đủ giờ';
    if (normalized.includes('thi') || normalized === 'thiếu giờ') return 'Thiếu giờ';
    if (normalized.includes('ch') || normalized.includes('checkout')) return 'Chưa checkout';
    return status;
  };

  // Helper để hiển thị trạng thái check-in (Muộn/Đúng giờ)
  const getCheckInStatus = (trang_thai: string) => {
    const status = normalizeStatus(trang_thai);
    if (status === 'Muộn') {
      return <span className="status-badge status-danger">Muộn</span>;
    }
    return <span className="status-badge status-success">Đúng giờ</span>;
  };

  // Helper để hiển thị trạng thái làm việc (Đủ giờ/Thiếu giờ/Chưa checkout)
  const getWorkStatus = (trang_thai_lam_viec: string) => {
    const status = normalizeStatus(trang_thai_lam_viec);
    if (status === 'Chưa checkout') {
      return <span className="status-badge status-info">Chưa checkout</span>;
    } else if (status === 'Đủ giờ') {
      return <span className="status-badge status-success">Đủ giờ</span>;
    } else {
      return <span className="status-badge status-warning">Thiếu giờ</span>;
    }
  };

  const todayColumns = [
    { key: 'ma_nv', title: 'Mã NV', width: '100px' },
    { key: 'ten_nv', title: 'Họ tên' },
    { key: 'ten_phong', title: 'Phòng ban', width: '150px' },
    {
      key: 'gio_vao',
      title: 'Giờ vào',
      width: '100px',
      align: 'center' as const,
      render: (value: string, record: any) => {
        const isLate = normalizeStatus(record.trang_thai) === 'Muộn';
        return (
          <span className={isLate ? 'text-danger' : 'text-success'}>
            {formatTime(value)}
          </span>
        );
      },
    },
    {
      key: 'gio_ra',
      title: 'Giờ ra',
      width: '100px',
      align: 'center' as const,
      render: (value: string | null) => 
        value ? formatTime(value) : <span className="text-warning">Chưa checkout</span>,
    },
    {
      key: 'so_gio',
      title: 'Số giờ',
      width: '100px',
      align: 'center' as const,
      render: (value: number) => `${value ? value.toFixed(1) : '0.0'}h`,
    },
    {
      key: 'trang_thai',
      title: 'Check-in',
      width: '120px',
      align: 'center' as const,
      render: (value: string) => getCheckInStatus(value),
    },
    {
      key: 'trang_thai_lam_viec',
      title: 'Làm việc',
      width: '130px',
      align: 'center' as const,
      render: (value: string) => getWorkStatus(value),
    },
  ];

  const lateColumns = [
    { 
      key: 'ngay_lam', 
      title: 'Ngày', 
      width: '120px', 
      render: (value: string) => formatDate(value) 
    },
    { key: 'ma_nv', title: 'Mã NV', width: '100px' },
    { key: 'ten_nv', title: 'Họ tên' },
    { key: 'ten_phong', title: 'Phòng ban', width: '150px' },
    { 
      key: 'gio_vao', 
      title: 'Giờ vào', 
      width: '100px', 
      align: 'center' as const, 
      render: (value: string) => <span className="text-danger">{formatTime(value)}</span> 
    },
    { 
      key: 'tre_phut', 
      title: 'Trễ', 
      width: '100px', 
      align: 'center' as const, 
      render: (value: string) => <span className="text-danger">{value || 'N/A'}</span> 
    },
  ];

  const notCheckedColumns = [
    { key: 'ma_nv', title: 'Mã NV', width: '100px' },
    { key: 'ten_nv', title: 'Họ tên' },
    { key: 'ten_phong', title: 'Phòng ban', width: '150px' },
    { 
      key: 'gio_vao', 
      title: 'Giờ check-in', 
      width: '120px', 
      align: 'center' as const, 
      render: (value: string) => formatTime(value) 
    },
    {
      key: 'trang_thai',
      title: 'Check-in',
      width: '120px',
      align: 'center' as const,
      render: (value: string) => getCheckInStatus(value),
    },
    { 
      key: 'da_lam', 
      title: 'Đã làm', 
      width: '120px', 
      align: 'center' as const, 
      render: (value: string) => <span className="text-warning">{value || 'N/A'}</span> 
    },
  ];

  const statsColumns = [
    { key: 'ma_nv', title: 'Mã NV', width: '100px' },
    { key: 'ten_nv', title: 'Họ tên' },
    { key: 'ten_phong', title: 'Phòng ban', width: '150px' },
    { 
      key: 'so_ngay_lam', 
      title: 'Số ngày', 
      width: '100px', 
      align: 'center' as const 
    },
    { 
      key: 'tong_gio', 
      title: 'Tổng giờ', 
      width: '100px', 
      align: 'center' as const, 
      render: (value: number) => `${value ? Math.round(value) : 0}h` 
    },
    { 
      key: 'gio_tb_ngay', 
      title: 'TB/ngày', 
      width: '100px', 
      align: 'center' as const, 
      render: (value: number) => `${value ? value.toFixed(1) : '0.0'}h` 
    },
    { 
      key: 'danh_gia', 
      title: 'Đánh giá', 
      width: '120px', 
      align: 'center' as const, 
      render: (value: string) => {
        const status = normalizeStatus(value);
        return (
          <span className={`status-badge status-${status === 'Đủ giờ' ? 'success' : 'warning'}`}>
            {status}
          </span>
        );
      }
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'today': {
        const dataWithKey = attendances.map(item => ({ ...item, key: item.id }));
        return <Table columns={todayColumns} data={dataWithKey} loading={loading} rowKey="key" emptyText="Chưa có ai chấm công hôm nay" />;
      }
      case 'late': {
        const dataWithKey = lateEmployees.map(emp => ({ ...emp, key: `${emp.ma_nv}-${emp.ngay_lam}` }));
        return (
          <div>
            <div className="stats-filter">
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="input">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => <option key={month} value={month}>Tháng {month}</option>)}
              </select>
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="input">
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <Table columns={lateColumns} data={dataWithKey} loading={loading} rowKey="key" emptyText="Không có nhân viên đi muộn" />
          </div>
        );
      }
      case 'notchecked': {
        const dataWithKey = notCheckedOut.map(emp => ({ ...emp, key: emp.ma_nv }));
        return <Table columns={notCheckedColumns} data={dataWithKey} loading={loading} rowKey="key" emptyText="Tất cả đã checkout" />;
      }
      case 'stats': {
        const dataWithKey = monthlyStats.map(emp => ({ ...emp, key: emp.ma_nv }));
        return (
          <div>
            <div className="stats-filter">
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="input">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => <option key={month} value={month}>Tháng {month}</option>)}
              </select>
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="input">
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <Table columns={statsColumns} data={dataWithKey} loading={loading} rowKey="key" emptyText="Chưa có dữ liệu thống kê" />
          </div>
        );
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý chấm công</h1>
          <p className="page-subtitle">Theo dõi chấm công và thống kê</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/attendance/check')} icon={
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }>Chấm công</Button>
      </div>

      <Card>
        <div className="tabs-container">
          <div className="tabs-header">
            <button className={`tab-button ${activeTab === 'today' ? 'tab-button-active' : ''}`} onClick={() => setActiveTab('today')}>
              Hôm nay ({attendances.length})
            </button>
            <button className={`tab-button ${activeTab === 'late' ? 'tab-button-active' : ''}`} onClick={() => setActiveTab('late')}>
              Đi muộn ({lateEmployees.length})
            </button>
            <button className={`tab-button ${activeTab === 'notchecked' ? 'tab-button-active' : ''}`} onClick={() => setActiveTab('notchecked')}>
              Chưa checkout ({notCheckedOut.length})
            </button>
            <button className={`tab-button ${activeTab === 'stats' ? 'tab-button-active' : ''}`} onClick={() => setActiveTab('stats')}>
              Thống kê tháng
            </button>
          </div>
          <div className="tabs-content">
            {renderTabContent()}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceList;