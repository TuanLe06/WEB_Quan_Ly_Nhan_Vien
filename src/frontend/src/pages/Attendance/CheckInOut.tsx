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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check today's attendance status
  useEffect(() => {
    checkTodayStatus();
  }, []);

  const checkTodayStatus = async () => {
    if (!user?.ma_nv) return;
    
    try {
      setCheckingStatus(true);
      const response = await attendanceApi.getHistory(user.ma_nv, {
        thang: new Date().getMonth() + 1,
        nam: new Date().getFullYear()
      });
      
      if (response.success && response.data) {
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = response.data.find((record: any) => 
          record.ngay_lam.split('T')[0] === today
        );
        setTodayAttendance(todayRecord || null);
      }
    } catch (error) {
      console.error('Failed to check status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleCheckIn = async () => {
    if (!user || !user.ma_nv) {
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
      setLoading(true);
      const response = await attendanceApi.checkIn(user.ma_nv);
      if (response.success) {
        setMessage('Check-in thành công! ✓');
        setMessageType('success');
        await checkTodayStatus();
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Check-in thất bại!');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user || !user.ma_nv) {
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
      setLoading(true);
      const response = await attendanceApi.checkOut(user.ma_nv);
      if (response.success) {
        setMessage('Check-out thành công! ✓');
        setMessageType('success');
        await checkTodayStatus();
        setTimeout(() => {
          navigate('/attendance');
        }, 2000);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Check-out thất bại!');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const isLate = () => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    return hour > 8 || (hour === 8 && minute > 15);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Chấm công</h1>
        <p className="page-subtitle">Check-in / Check-out hệ thống</p>
      </div>

      <Card>
        <div className="checkinout-container">
          {/* Header with Clock */}
          <div className="checkinout-header">
            <div className="greeting-text">{getGreeting()}, {user?.ten_nv}!</div>
            <div className="clock-icon">
              <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="current-time">{formatTime(currentTime)}</h2>
            <p className="current-date">{formatDate(currentTime)}</p>
            
            {isLate() && !todayAttendance && (
              <div className="late-warning">
                ⚠️ Bạn đang muộn giờ làm việc (8:00 AM)
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <div className={`checkinout-message ${messageType}`}>
              {message}
            </div>
          )}

          {/* Today's Status */}
          {!checkingStatus && (
            <div className="checkinout-status">
              {todayAttendance ? (
                <div className="status-card status-checked-in">
                  <div className="status-icon">✓</div>
                  <div className="status-content">
                    <div className="status-title">Đã check-in hôm nay</div>
                    <div className="status-details">
                      <div className="status-item">
                        <span className="status-label">Giờ vào:</span>
                        <span className="status-value">{todayAttendance.gio_vao}</span>
                      </div>
                      {todayAttendance.gio_ra ? (
                        <>
                          <div className="status-item">
                            <span className="status-label">Giờ ra:</span>
                            <span className="status-value">{todayAttendance.gio_ra}</span>
                          </div>
                          <div className="status-item">
                            <span className="status-label">Số giờ:</span>
                            <span className="status-value success">{todayAttendance.so_gio.toFixed(1)}h</span>
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
          )}

          {/* User Info */}
          <div className="checkinout-info">
            <div className="info-item">
              <span className="info-label">Nhân viên:</span>
              <span className="info-value">{user?.ten_nv}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Mã NV:</span>
              <span className="info-value">{user?.ma_nv}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phòng ban:</span>
              <span className="info-value">{user?.ma_phong || 'Chưa có'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Chức vụ:</span>
              <span className="info-value">{user?.vai_tro || 'Chưa có'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="checkinout-actions">
            <Button
              variant="success"
              size="lg"
              onClick={handleCheckIn}
              loading={loading}
              disabled={!!todayAttendance}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              }
            >
              {todayAttendance ? 'Đã Check-in' : 'Check In'}
            </Button>

            <Button
              variant="danger"
              size="lg"
              onClick={handleCheckOut}
              loading={loading}
              disabled={!todayAttendance || !!todayAttendance?.gio_ra}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              }
            >
              {todayAttendance?.gio_ra ? 'Đã Check-out' : 'Check Out'}
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/attendance')}
            disabled={loading}
          >
            Quay lại danh sách
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CheckInOut;