import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceApi } from '../../api/attendanceApi';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import './Attendance.css';

const CheckInOut: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [loadingCheckOut, setLoadingCheckOut] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Đồng hồ cập nhật mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Kiểm tra trạng thái hôm nay khi user thay đổi
  useEffect(() => {
    if (user?.ma_nv) checkTodayStatus();
  }, [user]);

  const formatTimeDisplay = (timeString: string) => {
    if (!timeString) return '';
    return timeString.slice(0, 5); // HH:MM
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
        setTodayAttendance(response.data); // dùng toàn bộ object trả về
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Check-in thất bại!';
      setMessage(errorMsg);
      setMessageType('error');
      console.error('Check-in error:', error);
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
        setTodayAttendance(response.data); // cập nhật toàn bộ record
        setTimeout(() => navigate('/attendance'), 2000);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Check-out thất bại!';
      setMessage(errorMsg);
      setMessageType('error');
      console.error('Check-out error:', error);
    } finally {
      setLoadingCheckOut(false);
    }
  };

  const formatTime = (date: Date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (date: Date) => date.toLocaleDateString('vi-VN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const getGreeting = () => {
    const h = currentTime.getHours();
    return h < 12 ? 'Chào buổi sáng' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  };

  const isLate = () => {
    // Cảnh báo muộn khi chưa check-in
    if (todayAttendance?.gio_vao) return false;
    const h = currentTime.getHours();
    const m = currentTime.getMinutes();
    return h > 8 || (h === 8 && m > 15);
  };

  const isCheckoutDisabled = () => !(todayAttendance && !todayAttendance.gio_ra);
  const isCheckinDisabled = () => !!todayAttendance;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Chấm công</h1>
        <p className="page-subtitle">Check-in / Check-out hệ thống</p>
      </div>

      <Card>
        <div className="checkinout-container">
          <div className="checkinout-header">
            <div className="greeting-text">{getGreeting()}, {user?.ten_nv}!</div>
            <div className="clock-icon">
              <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="current-time">{formatTime(currentTime)}</h2>
            <p className="current-date">{formatDate(currentTime)}</p>
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

          <div className="checkinout-info">
            <div className="info-item"><span className="info-label">Nhân viên:</span><span className="info-value">{user?.ten_nv}</span></div>
            <div className="info-item"><span className="info-label">Mã NV:</span><span className="info-value">{user?.ma_nv}</span></div>
            <div className="info-item"><span className="info-label">Phòng ban:</span><span className="info-value">{user?.ma_phong || 'Chưa có'}</span></div>
            <div className="info-item"><span className="info-label">Chức vụ:</span><span className="info-value">{user?.vai_tro || 'Chưa có'}</span></div>
          </div>

          <div className="checkinout-actions">
            <Button variant="success" size="lg" onClick={handleCheckIn} loading={loadingCheckIn} disabled={isCheckinDisabled() || checkingStatus}>Check In</Button>
            <Button variant="danger" size="lg" onClick={handleCheckOut} loading={loadingCheckOut} disabled={isCheckoutDisabled() || checkingStatus}>Check Out</Button>
          </div>

          <Button variant="outline" onClick={() => navigate('/attendance')} disabled={loadingCheckIn || loadingCheckOut}>Quay lại danh sách</Button>
        </div>
      </Card>
    </div>
  );
};

export default CheckInOut;
