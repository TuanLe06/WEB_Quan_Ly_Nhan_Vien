import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import { DashboardStats } from '../../types';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Đang tải thống kê..." />;
  }

  return (
    <div className="dashboard">
      <h2 className="page-title">Dashboard</h2>

      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats?.tongNhanVien || 0}</h3>
            <p>Tổng nhân viên</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>{stats?.tongPhongBan || 0}</h3>
            <p>Phòng ban</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats?.daChamCong || 0}</h3>
            <p>Đã chấm công hôm nay</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats?.yeuCauNghiPhep || 0}</h3>
            <p>Yêu cầu nghỉ phép</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{(stats?.tongLuongThang || 0).toLocaleString('vi-VN')} đ</h3>
            <p>Quỹ lương tháng này</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{stats?.hopDongSapHetHan || 0}</h3>
            <p>Hợp đồng sắp hết hạn</p>
          </div>
        </Card>
      </div>

      <div className="dashboard-row">
        <Card title="📊 Thông tin tổng quan">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nhân viên mới tháng này:</span>
              <span className="info-value">{stats?.nhanVienMoi || 0} người</span>
            </div>
            <div className="info-item">
              <span className="info-label">Đang nghỉ phép hôm nay:</span>
              <span className="info-value">{stats?.nghiPhepHomNay || 0} người</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;