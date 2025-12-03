// src/pages/Dashboard/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import { attendanceApi } from '../../api/attendanceApi';
import { leaveApi } from '../../api/leaveApi';
import { DashboardStats, Attendance, Leave } from '../../types';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { formatCurrency } from '../../utils/formatters';
import './Dashboard.css';

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactElement;
  color: string;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentAttendances, setRecentAttendances] = useState<Attendance[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<Leave[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [statsRes, attendanceRes, leaveRes] = await Promise.all([
        dashboardApi.getStats(),
        attendanceApi.getToday(),
        leaveApi.getAll({ page: 1, limit: 10 })
      ]);

      // Set stats
      if (statsRes.success && statsRes.data) {
        const data = statsRes.data;
        setStats([
          {
            title: 'Tổng nhân viên',
            value: data.tongNhanVien || 0,
            change: `${data.nhanVienMoi || 0} nhân viên mới`,
            changeType: 'positive',
            icon: (
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ),
            color: '#2563eb',
          },
          {
            title: 'Đã chấm công',
            value: data.daChamCong || 0,
            change: data.tongNhanVien > 0 ? `${((data.daChamCong / data.tongNhanVien) * 100).toFixed(1)}% tỷ lệ` : '0%',
            changeType: 'positive',
            icon: (
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: '#10b981',
          },
          {
            title: 'Yêu cầu nghỉ phép',
            value: data.yeuCauNghiPhep || 0,
            change: `${data.nghiPhepHomNay || 0} nghỉ hôm nay`,
            changeType: 'neutral',
            icon: (
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ),
            color: '#f59e0b',
          },
          {
            title: 'Tổng lương tháng',
            value: data.tongLuongThang ? formatCurrency(data.tongLuongThang) : '0 ₫',
            change: `Hợp đồng sắp hết: ${data.hopDongSapHetHan || 0}`,
            changeType: 'positive',
            icon: (
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: '#8b5cf6',
          },
        ]);
      }

      // Set recent attendances
      if (attendanceRes.success && attendanceRes.data) {
        setRecentAttendances(attendanceRes.data.slice(0, 5));
      }

      // Set pending leaves (only status "Chờ duyệt")
      if (leaveRes.success && leaveRes.data) {
        const pending = leaveRes.data.filter((leave: Leave) => leave.trang_thai === 'Chờ duyệt');
        setPendingLeaves(pending.slice(0, 3));
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullscreen text="Đang tải dashboard..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Tổng quan hệ thống quản lý nhân sự</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ '--stat-color': stat.color } as React.CSSProperties}>
            <div className="stat-icon" style={{ background: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-title">{stat.title}</div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change stat-change-${stat.changeType}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <Card title="Chấm công gần đây" className="dashboard-card">
          <div className="attendance-list">
            {recentAttendances.length > 0 ? (
              recentAttendances.map((att) => (
                <div key={att.id} className="attendance-item">
                  <div className="attendance-avatar">
                    {att.ten_nv?.charAt(0).toUpperCase() || 'N'}
                  </div>
                  <div className="attendance-info">
                    <div className="attendance-name">{att.ten_nv || 'Nhân viên'}</div>
                    <div className="attendance-time">Check-in: {att.gio_vao}</div>
                  </div>
                  <div className="attendance-status status-present">
                    {att.trang_thai || 'Đúng giờ'}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                Chưa có ai chấm công hôm nay
              </p>
            )}
          </div>
        </Card>

        <Card title="Đơn nghỉ phép chờ duyệt" className="dashboard-card">
          <div className="leave-list">
            {pendingLeaves.length > 0 ? (
              pendingLeaves.map((leave) => (
                <div key={leave.id} className="leave-item">
                  <div className="leave-info">
                    <div className="leave-name">{leave.ten_nv || 'Nhân viên'}</div>
                    <div className="leave-date">
                      {new Date(leave.ngay_bat_dau).toLocaleDateString('vi-VN')} - {new Date(leave.ngay_ket_thuc).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div className="leave-actions">
                    <button className="leave-btn leave-btn-approve">Duyệt</button>
                    <button className="leave-btn leave-btn-reject">Từ chối</button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                Không có đơn chờ duyệt
              </p>
            )}
          </div>
        </Card>

        <Card title="Thống kê phòng ban" className="dashboard-card dashboard-card-full">
          <div className="new-employees">
            <div className="employee-card">
              <div className="employee-avatar">
                <span>📊</span>
              </div>
              <div className="employee-name">Tổng nhân viên</div>
              <div className="employee-position">{stats[0]?.value || 0} người</div>
              <div className="employee-date">Đang làm việc</div>
            </div>
            <div className="employee-card">
              <div className="employee-avatar">
                <span>✓</span>
              </div>
              <div className="employee-name">Đã chấm công</div>
              <div className="employee-position">{stats[1]?.value || 0} người</div>
              <div className="employee-date">Hôm nay</div>
            </div>
            <div className="employee-card">
              <div className="employee-avatar">
                <span>📅</span>
              </div>
              <div className="employee-name">Nghỉ phép</div>
              <div className="employee-position">{pendingLeaves.length} yêu cầu</div>
              <div className="employee-date">Chờ duyệt</div>
            </div>
            <div className="employee-card">
              <div className="employee-avatar">
                <span>📄</span>
              </div>
              <div className="employee-name">Hợp đồng</div>
              <div className="employee-position">{stats[3]?.change.match(/\d+/)?.[0] || 0} hợp đồng</div>
              <div className="employee-date">Sắp hết hạn</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;