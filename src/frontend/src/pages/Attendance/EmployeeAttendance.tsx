import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import { formatDate, formatTime } from '../../utils/formatters';
import './Attendance.css';

const EmployeeAttendance: React.FC = () => {
  const { user } = useAuth();

  // Check In/Out State
  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [loadingCheckOut, setLoadingCheckOut] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // History State
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthStats, setMonthStats] = useState({
    so_ngay_lam: 0,
    tong_gio: 0,
    di_muon: 0,
    ve_som: 0
  });

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check today status
  useEffect(() => {
    if (user?.ma_nv) checkTodayStatus();
  }, [user]);

  // Load history when month/year changes
  useEffect(() => {
    if (user?.ma_nv) loadHistory();
  }, [user, selectedMonth, selectedYear]);

  const formatTimeDisplay = (timeString: string) => {
    if (!timeString) return '';
    return timeString.slice(0, 5);
  };

  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const isSameDate = (dateString: string, targetDate: string) => {
    const d = new Date(dateString);
    const date1 = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return date1 === targetDate;
  };

  const checkTodayStatus = async () => {
    if (!user?.ma_nv) return;
    try {
      setCheckingStatus(true);
      const response = await attendanceApi.getHistory(user.ma_nv, {
        thang: new Date().getMonth() + 1,
        nam: new Date().getFullYear()
      });
      if (response.success && response.data) {
        const today = getTodayDateString();
        const todayRecord = response.data.find((record: any) => isSameDate(record.ngay_lam, today));
        setTodayAttendance(todayRecord || null);
      }
    } catch (error) {
      console.error('Failed to check status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const loadHistory = async () => {
    if (!user?.ma_nv) return;
    try {
      setLoadingHistory(true);
      const response = await attendanceApi.getHistory(user.ma_nv, {
        thang: selectedMonth,
        nam: selectedYear
      });
      
      if (response.success && response.data) {
        setHistory(response.data);
        
        // Calculate stats
        const stats = response.data.reduce((acc: any, item: any) => {
          acc.so_ngay_lam += 1;
          acc.tong_gio += item.so_gio || 0;
          if (item.trang_thai?.toLowerCase().includes('muộn')) acc.di_muon += 1;
          if (item.trang_thai?.toLowerCase().includes('sớm')) acc.ve_som += 1;
          return acc;
        }, { so_ngay_lam: 0, tong_gio: 0, di_muon: 0, ve_som: 0 });
        
        setMonthStats(stats);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCheckIn = async () => {
    if (!user?.ma_nv) {
      setMessage('Không tìm thấy thông tin nhân viên');
      setMessageType('error');
      return;
    }
    if (todayAttendance) {
      setMessage('Bạn đã check-in hôm nay rồi!');
      setMessageType('error');
      return;
    }
    try {
      setLoadingCheckIn(true);
      setMessage('');
      const response = await attendanceApi.checkIn(user.ma_nv);
      if (response.success) {
        setMessage('Check-in thành công! ✓');
        setMessageType('success');
        setTodayAttendance(response.data);
        loadHistory(); // Reload history
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Check-in thất bại!';
      setMessage(errorMsg);
      setMessageType('error');
    } finally {
      setLoadingCheckIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user?.ma_nv) {
      setMessage('Không tìm thấy thông tin nhân viên');
      setMessageType('error');
      return;
    }
    if (!todayAttendance) {
      setMessage('Bạn chưa check-in hôm nay!');
      setMessageType('error');
      return;
    }
    if (todayAttendance.gio_ra) {
      setMessage('Bạn đã check-out hôm nay rồi!');
      setMessageType('error');
      return;
    }
    try {
      setLoadingCheckOut(true);
      setMessage('');
      const response = await attendanceApi.checkOut(user.ma_nv);
      if (response.success) {
        setMessage('Check-out thành công! ✓');
        setMessageType('success');
        setTodayAttendance(response.data);
        loadHistory(); // Reload history
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Check-out thất bại!';
      setMessage(errorMsg);
      setMessageType('error');
    } finally {
      setLoadingCheckOut(false);
    }
  };

  const formatTimeFunc = (date: Date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDateFunc = (date: Date) => date.toLocaleDateString('vi-VN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const getGreeting = () => {
    const h = currentTime.getHours();
    return h < 12 ? 'Chào buổi sáng' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  };

  const isLate = () => {
    if (todayAttendance?.gio_vao) return false;
    const h = currentTime.getHours();
    const m = currentTime.getMinutes();
    return h > 8 || (h === 8 && m > 15);
  };

  const isCheckoutDisabled = () => !(todayAttendance && !todayAttendance.gio_ra);
  const isCheckinDisabled = () => !!todayAttendance;

  const getStatusClass = (status: string) => {
    const normalized = status.toLowerCase().replace(/\s+/g, '-');
    return `status-${normalized}`;
  };

  // History columns
  const historyColumns = [
    {
      key: 'ngay_lam',
      title: 'Ngày',
      width: '130px',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'gio_vao',
      title: 'Giờ vào',
      width: '100px',
      align: 'center' as const,
      render: (value: string) => value ? value.slice(0, 5) : ''
    },
    {
      key: 'gio_ra',
      title: 'Giờ ra',
      width: '100px',
      align: 'center' as const,
      render: (value: string | null) => 
        value ? value.slice(0, 5) : <span className="text-warning">Chưa checkout</span>
    },
    {
      key: 'so_gio',
      title: 'Số giờ',
      width: '100px',
      align: 'center' as const,
      render: (value: number) => <strong>{value ? value.toFixed(1) : '0.0'}h</strong>
    },
    {
      key: 'trang_thai',
      title: 'Trạng thái',
      width: '120px',
      align: 'center' as const,
      render: (value: string) => (
        <span className={`status-badge ${getStatusClass(value)}`}>
          {value}
        </span>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">⏰ Chấm công</h1>
        <p className="page-subtitle">Check-in, Check-out và lịch sử chấm công</p>
      </div>

      {/* CHECK IN/OUT SECTION */}
      <Card>
        <div className="checkinout-container">
          <div className="checkinout-header">
            <div className="greeting-text">{getGreeting()}, {user?.ten_nv}!</div>
            <div className="clock-icon">
              <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="current-time">{formatTimeFunc(currentTime)}</h2>
            <p className="current-date">{formatDateFunc(currentTime)}</p>
            {isLate() && <div className="late-warning">⚠️ Bạn đang muộn giờ làm việc (8:15 AM)</div>}
          </div>

          {message && <div className={`checkinout-message ${messageType}`}>{message}</div>}

          {!checkingStatus ? (
            <div className="checkinout-status">
              {todayAttendance ? (
                <div className="status-card status-checked-in">
                  <div className="status-icon">✓</div>
                  <div className="status-content">
                    <div className="status-title">Đã check-in hôm nay</div>
                    <div className="status-details">
                      <div className="status-item">
                        <span className="status-label">Giờ vào:</span>
                        <span className="status-value">{formatTimeDisplay(todayAttendance.gio_vao)}</span>
                      </div>
                      {todayAttendance.gio_ra ? (
                        <>
                          <div className="status-item">
                            <span className="status-label">Giờ ra:</span>
                            <span className="status-value">{formatTimeDisplay(todayAttendance.gio_ra)}</span>
                          </div>
                          <div className="status-item">
                            <span className="status-label">Số giờ:</span>
                            <span className="status-value success">{Number(todayAttendance.so_gio).toFixed(1)}h</span>
                          </div>
                        </>
                      ) : (
                        <div className="status-item">
                          <span className="status-label">Trạng thái:</span>
                          <span className="status-value warning">Chưa check-out</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="status-card status-not-checked">
                  <div className="status-icon">ℹ️</div>
                  <div className="status-content">
                    <div className="status-title">Chưa chấm công hôm nay</div>
                    <div className="status-subtitle">Vui lòng check-in để bắt đầu làm việc</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="checkinout-status">
              <div className="status-card">
                <div className="status-content">
                  <div className="status-title">Đang kiểm tra trạng thái...</div>
                </div>
              </div>
            </div>
          )}

          <div className="checkinout-actions">
            <Button 
              variant="success" 
              size="lg" 
              onClick={handleCheckIn} 
              loading={loadingCheckIn} 
              disabled={isCheckinDisabled() || checkingStatus}
            >
              Check In
            </Button>
            <Button 
              variant="danger" 
              size="lg" 
              onClick={handleCheckOut} 
              loading={loadingCheckOut} 
              disabled={isCheckoutDisabled() || checkingStatus}
            >
              Check Out
            </Button>
          </div>
        </div>
      </Card>

      {/* HISTORY SECTION */}
      <Card title="📋 Lịch sử chấm công">
        <div className="attendance-history-container">
          {/* Month Stats */}
          <div className="month-stats-grid">
            <div className="stat-item-small">
              <div className="stat-label-small">Số ngày làm</div>
              <div className="stat-value-small">{monthStats.so_ngay_lam}</div>
            </div>
            <div className="stat-item-small">
              <div className="stat-label-small">Tổng giờ</div>
              <div className="stat-value-small">{monthStats.tong_gio.toFixed(1)}h</div>
            </div>
            <div className="stat-item-small">
              <div className="stat-label-small">Đi muộn</div>
              <div className="stat-value-small text-danger">{monthStats.di_muon}</div>
            </div>
          </div>

          {/* Month/Year Filter */}
          <div className="history-filters">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="input"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>Tháng {month}</option>
              ))}
            </select>

            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="input"
            >
              {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* History Table */}
          <Table
            columns={historyColumns}
            data={history.map(item => ({ ...item, key: item.id }))}
            loading={loadingHistory}
            rowKey="key"
            emptyText="Chưa có dữ liệu chấm công"
          />
        </div>
      </Card>
    </div>
  );
};

export default EmployeeAttendance;