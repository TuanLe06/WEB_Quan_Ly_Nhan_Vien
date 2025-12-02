import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import { DashboardStats } from '../../types';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import './Dashboard.css';

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getStats();
      
      if (response.success && response.data) {
        const data = response.data;
        setStats([
          {
            title: 'Tổng nhân viên',
            value: data.tongNhanVien,
            change: `${data.nhanVienMoi} nhân viên mới`,
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
            value: data.daChamCong,
            change: `${((data.daChamCong / data.tongNhanVien) * 100).toFixed(1)}% tỷ lệ đi làm`,
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
            value: data.yeuCauNghiPhep,
            change: `${data.nghiPhepHomNay} nghỉ hôm nay`,
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
            value: `${(data.tongLuongThang / 1000000).toFixed(1)}M`,
            change: `Hợp đồng sắp hết: ${data.hopDongSapHetHan}`,
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
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="attendance-item">
                <div className="attendance-avatar">NV</div>
                <div className="attendance-info">
                  <div className="attendance-name">Nhân viên {i}</div>
                  <div className="attendance-time">Check-in: 08:30 AM</div>
                </div>
                <div className="attendance-status status-present">
                  Đúng giờ
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Đơn nghỉ phép chờ duyệt" className="dashboard-card">
          <div className="leave-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="leave-item">
                <div className="leave-info">
                  <div className="leave-name">Nhân viên {i}</div>
                  <div className="leave-date">15/12 - 17/12/2024</div>
                </div>
                <div className="leave-actions">
                  <button className="leave-btn leave-btn-approve">Duyệt</button>
                  <button className="leave-btn leave-btn-reject">Từ chối</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Phòng ban" className="dashboard-card dashboard-card-full">
          <div className="new-employees">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="employee-card">
                <div className="employee-avatar">
                  <span>PB{i}</span>
                </div>
                <div className="employee-name">Phòng ban {i}</div>
                <div className="employee-position">{10 + i} nhân viên</div>
                <div className="employee-date">Thành lập: 2020</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;