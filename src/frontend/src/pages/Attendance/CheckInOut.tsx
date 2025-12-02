import React, { useState } from 'react';
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

  const handleCheckIn = async () => {
    if (!user || !user.ma_nv) {
      alert('Không tìm thấy thông tin nhân viên');
      return;
    }

    try {
      setLoading(true);
      const response = await attendanceApi.checkIn(user.ma_nv);
      if (response.success) {
        setMessage('Check-in thành công! ✓');
        setTimeout(() => navigate('/attendance'), 2000);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Check-in thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user || !user.ma_nv) {
      alert('Không tìm thấy thông tin nhân viên');
      return;
    }

    try {
      setLoading(true);
      const response = await attendanceApi.checkOut(user.ma_nv);
      if (response.success) {
        setMessage('Check-out thành công! ✓');
        setTimeout(() => navigate('/attendance'), 2000);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Check-out thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const currentTime = new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Chấm công</h1>
        <p className="page-subtitle">Check-in / Check-out</p>
      </div>

      <Card>
        <div className="checkinout-container">
          <div className="checkinout-header">
            <div className="clock-icon">
              <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="current-time">{currentTime}</h2>
            <p className="current-date">{new Date().toLocaleDateString('vi-VN')}</p>
          </div>

          {message && (
            <div className={`checkinout-message ${message.includes('thành công') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

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
              <span className="info-value">{user?.ten_phong || 'Chưa có'}</span>
            </div>
          </div>

          <div className="checkinout-actions">
            <Button
              variant="success"
              size="lg"
              onClick={handleCheckIn}
              loading={loading}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              }
            >
              Check In
            </Button>

            <Button
              variant="danger"
              size="lg"
              onClick={handleCheckOut}
              loading={loading}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              }
            >
              Check Out
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/attendance')}
            disabled={loading}
          >
            Quay lại
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CheckInOut;