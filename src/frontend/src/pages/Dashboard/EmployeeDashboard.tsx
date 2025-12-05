import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeDashboardApi, EmployeeDashboardData } from '../../api/employeeDashboardApi';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import './EmployeeDashboard.css';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<EmployeeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    if (!user?.ma_nv) return;

    try {
      setLoading(true);
      setError(null);
      const response = await employeeDashboardApi.getEmployeeDashboard(user.ma_nv);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError('Không thể tải dữ liệu dashboard');
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      setError('Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>{error || 'Không thể tải dữ liệu dashboard'}</h3>
        <Button onClick={loadDashboard}>Thử lại</Button>
      </div>
    );
  }

  const {
    employee,
    attendance,
    leave,
    salary,
    contract,
    notifications,
    summary
  } = data;
  
  const attendCurrent = {
    so_ngay_lam: attendance.current?.so_ngay_lam ?? 0,
    tong_gio: attendance.current?.tong_gio ?? 0,
    gio_trung_binh: attendance.current?.gio_trung_binh ?? 0,
    di_muon: attendance.current?.di_muon ?? 0,
    today: attendance.today ?? null,
    recent: attendance.recent ?? []
  };
  const salaryLatest = salary.latest;
  const salaryHistory = salary.history;

  // Get status color for attendance
  const getStatusClass = (status: string) => {
    const normalized = status.toLowerCase().replace(/\s+/g, '-');
    return `status-${normalized}`;
  };

  return (
    <div className="employee-dashboard">

      {/* HEADER - Employee Info Card */}
      <section className="dashboard-header">
        <Card className="employee-info-card">
          <div className="employee-avatar">
            {employee.avatar ? (
              <img src={employee.avatar} alt={employee.ten_nv} />
            ) : (
              <div className="avatar-placeholder">
                {employee.ten_nv.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="employee-details">
            <h1 className="employee-name">{employee.ten_nv}</h1>
            <div className="employee-meta">
              <span className="badge badge-primary">
                👔 {employee.ten_chuc_vu}
              </span>
              <span className="badge badge-secondary">
                🏢 {employee.ten_phong}
              </span>
            </div>
            <div className="employee-contact">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>{employee.email || 'Chưa cập nhật'}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <span>{employee.so_dien_thoai || 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>

          <div className="employee-quick-actions">
            <Button 
              size="sm" 
              onClick={() => navigate('/attendance/check')}
              className="action-button"
            >
              <span className="button-icon">⏰</span>
              Chấm công
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => navigate('/leave/request')}
              className="action-button"
            >
              <span className="button-icon">🏖️</span>
              Xin nghỉ phép
            </Button>
          </div>
        </Card>
      </section>

      {/* NOTIFICATIONS */}
      {notifications.length > 0 && (
        <section className="notifications-section">
          {notifications.map((notif, index) => (
            <div key={index} className={`notification notification-${notif.type}`}>
              <div className="notification-icon">
                {notif.type === 'warning' && '⚠️'}
                {notif.type === 'danger' && '❌'}
                {notif.type === 'info' && 'ℹ️'}
                {notif.type === 'success' && '✅'}
              </div>
              <div className="notification-content">
                <strong>{notif.title}</strong>
                <span>{notif.message}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* QUICK STATS */}
      <section className="quick-stats-grid">
        <Card className="stat-card stat-primary">
          <div className="stat-icon">⏰</div>
          <div className="stat-details">
            <div className="stat-label">Giờ làm tháng này</div>
            <div className="stat-value">{summary.gio_lam_thang_nay.toFixed(1)}<span className="stat-unit">h</span></div>
            <div className="stat-subtitle">
              Còn lại: {summary.gio_con_lai.toFixed(1)}h / 40h
            </div>
          </div>
        </Card>

        <Card className="stat-card stat-success">
          <div className="stat-icon">💰</div>
          <div className="stat-details">
            <div className="stat-label">Lương tháng này</div>
            <div className="stat-value">
              {salaryLatest ? (
                <>
                  {(salaryLatest.luong_thuc_nhan / 1_000_000).toFixed(1)}
                  <span className="stat-unit">M</span>
                </>
              ) : 'N/A'}
            </div>
            <div className="stat-subtitle">
              {salaryLatest ? `Tháng ${salaryLatest.thang}/${salaryLatest.nam}` : 'Chưa tính'}
            </div>
          </div>
        </Card>

        <Card className="stat-card stat-info">
          <div className="stat-icon">🏖️</div>
          <div className="stat-details">
            <div className="stat-label">Ngày phép năm nay</div>
            <div className="stat-value">{summary.ngay_phep_da_dung}<span className="stat-unit">ngày</span></div>
            <div className="stat-subtitle">
              Còn lại: {summary.ngay_phep_con_lai} ngày
            </div>
          </div>
        </Card>

        <Card className="stat-card stat-warning">
          <div className="stat-icon">⚡</div>
          <div className="stat-details">
            <div className="stat-label">Đi muộn tháng này</div>
            <div className="stat-value">{attendCurrent.di_muon}<span className="stat-unit">lần</span></div>
            <div className="stat-subtitle">
              {attendCurrent.di_muon > 3 ? '⚠️ Cần chú ý!' : '✨ Tốt lắm!'}
            </div>
          </div>
        </Card>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="dashboard-grid">

        {/* ATTENDANCE CARD */}
        <Card className="dashboard-card">
          <div className="card-header">
            <h3>📊 Chấm công tháng này</h3>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => navigate('/attendance')}
            >
              Xem chi tiết →
            </Button>
          </div>

          <div className="card-body">
            <div className="attendance-summary">
              <div className="attendance-stat">
                <label>Số ngày làm</label>
                <strong>{attendCurrent.so_ngay_lam}</strong>
              </div>
              <div className="attendance-stat">
                <label>Tổng giờ</label>
                <strong>{attendCurrent.tong_gio.toFixed(1)}h</strong>
              </div>
              <div className="attendance-stat">
                <label>Đi muộn</label>
                <strong className="text-warning">{attendCurrent.di_muon}</strong>
              </div>
            </div>

            {/* Today Attendance */}
            {attendance.today && (
              <div className="today-attendance">
                <div className="section-title">
                  <span className="title-icon">📅</span>
                  <h4>Hôm nay</h4>
                </div>
                <div className="attendance-time">
                  <div className="time-item">
                    <span className="time-label">Vào</span>
                    <strong className="time-value">{formatTime(attendance.today.gio_vao)}</strong>
                  </div>
                  <div className="time-separator">→</div>
                  <div className="time-item">
                    <span className="time-label">Ra</span>
                    <strong className="time-value">
                      {attendance.today.gio_ra
                        ? formatTime(attendance.today.gio_ra)
                        : 'Chưa checkout'}
                    </strong>
                  </div>
                  <span className={`status-badge ${getStatusClass(attendance.today.trang_thai)}`}>
                    {attendance.today.trang_thai}
                  </span>
                </div>
              </div>
            )}

            {/* Recent Attendance */}
            {attendance.recent.length > 0 && (
              <div className="recent-section">
                <div className="section-title">
                  <span className="title-icon">📋</span>
                  <h4>7 ngày gần nhất</h4>
                </div>
                <div className="attendance-timeline">
                  {attendance.recent.map((item, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-date">
                        <span className="date-text">{formatDate(item.ngay_lam)}</span>
                      </div>
                      <div className="timeline-details">
                        <div className="timeline-time">
                          {formatTime(item.gio_vao)} - {item.gio_ra ? formatTime(item.gio_ra) : '...'}
                        </div>
                        <div className="timeline-hours">
                          <strong>{item.so_gio}h</strong>
                        </div>
                      </div>
                      <span className={`status-badge ${getStatusClass(item.trang_thai)}`}>
                        {item.trang_thai}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* LEAVE CARD */}
        <Card className="dashboard-card">
          <div className="card-header">
            <h3>🏖️ Nghỉ phép</h3>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => navigate('/leave')}
            >
              Xem chi tiết →
            </Button>
          </div>

          <div className="card-body">
            <div className="leave-summary">
              <div className="leave-stat">
                <label>Đã duyệt</label>
                <div className="leave-count">{leave.da_duyet}</div>
              </div>
              <div className="leave-stat">
                <label>Chờ duyệt</label>
                <div className="leave-count">{leave.cho_duyet}</div>
              </div>
              <div className="leave-stat">
                <label>Từ chối</label>
                <div className="leave-count">{leave.tu_choi}</div>
              </div>
            </div>

            {leave.recent.length > 0 ? (
              <div className="recent-section">
                <div className="section-title">
                  <span className="title-icon">📋</span>
                  <h4>Đơn gần nhất</h4>
                </div>
                {leave.recent.map((item) => (
                  <div key={item.id} className="leave-item">
                    <div className="leave-item-header">
                      <span className="leave-type">
                        <span className="type-icon">📝</span>
                        {item.loai_phep}
                      </span>
                      <span className={`status-badge ${getStatusClass(item.trang_thai)}`}>
                        {item.trang_thai}
                      </span>
                    </div>
                    <div className="leave-item-body">
                      <div className="leave-date">
                        <span className="date-icon">📅</span>
                        {formatDate(item.ngay_bat_dau)} → {formatDate(item.ngay_ket_thuc)}
                        <strong className="leave-days"> ({item.so_ngay} ngày)</strong>
                      </div>
                      {item.ly_do && (
                        <div className="leave-reason">
                          <span className="reason-icon">💬</span>
                          {item.ly_do}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>Chưa có đơn nghỉ phép nào</p>
              </div>
            )}
          </div>
        </Card>

        {/* SALARY CARD */}
        <Card className="dashboard-card">
          <div className="card-header">
            <h3>💰 Lương</h3>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => navigate('/salary')}
            >
              Xem chi tiết →
            </Button>
          </div>

          <div className="card-body">
            {salaryLatest ? (
              <>
                <div className="salary-latest">
                  <div className="salary-header">
                    <div className="salary-month">
                      <span className="month-icon">📅</span>
                      Tháng {salaryLatest.thang}/{salaryLatest.nam}
                    </div>
                  </div>
                  <div className="salary-amount">
                    {formatCurrency(salaryLatest.luong_thuc_nhan)}
                  </div>
                  <div className="salary-breakdown">
                    <div className="salary-row">
                      <span className="salary-label">
                        <span className="label-icon">💵</span>
                        Lương cơ bản
                      </span>
                      <strong>{formatCurrency(salaryLatest.luong_co_ban)}</strong>
                    </div>
                    <div className="salary-row">
                      <span className="salary-label">
                        <span className="label-icon">⏰</span>
                        Tổng giờ
                      </span>
                      <strong>{salaryLatest.tong_gio}h</strong>
                    </div>
                    {salaryLatest.luong_them > 0 && (
                      <div className="salary-row salary-bonus">
                        <span className="salary-label">
                          <span className="label-icon">✨</span>
                          Thưởng thêm giờ
                        </span>
                        <strong className="text-success">+{formatCurrency(salaryLatest.luong_them)}</strong>
                      </div>
                    )}
                    {salaryLatest.tru_luong > 0 && (
                      <div className="salary-row salary-deduction">
                        <span className="salary-label">
                          <span className="label-icon">⚠️</span>
                          Trừ lương
                        </span>
                        <strong className="text-danger">-{formatCurrency(salaryLatest.tru_luong)}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Salary Chart */}
                {salaryHistory.length > 0 && (
                  <div className="salary-chart">
                    <div className="section-title">
                      <span className="title-icon">📈</span>
                      <h4>Lịch sử 6 tháng</h4>
                    </div>
                    <div className="chart-bars">
                      {salaryHistory.map((item, index) => {
                        const maxSalary = Math.max(...salaryHistory.map(s => s.luong_thuc_nhan));
                        const height = (item.luong_thuc_nhan / maxSalary) * 100;

                        return (
                          <div key={index} className="chart-bar">
                            <div 
                              className="bar-value" 
                              style={{ height: `${height}%` }}
                              title={formatCurrency(item.luong_thuc_nhan)}
                            >
                              <span className="bar-label">
                                {(item.luong_thuc_nhan / 1_000_000).toFixed(1)}M
                              </span>
                            </div>
                            <div className="bar-month">T{item.thang}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">💰</div>
                <p>Chưa có dữ liệu lương</p>
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
};

export default EmployeeDashboard;