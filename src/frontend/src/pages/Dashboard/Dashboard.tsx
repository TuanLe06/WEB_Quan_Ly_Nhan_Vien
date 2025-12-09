import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import { salaryApi } from '../../api/salaryApi';
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
  const [employeesByDept, setEmployeesByDept] = useState<any[]>([]);
  const [employeesByPos, setEmployeesByPos] = useState<any[]>([]);
  const [salaryTrend, setSalaryTrend] = useState<any[]>([]);
  const [topEmployees, setTopEmployees] = useState<any[]>([]);
  const [topSalaries, setTopSalaries] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      // Load tất cả data song song
      const [
        statsRes,
        deptRes,
        posRes,
        salaryRes,
        topRes,
        topSalaryRes,
        activitiesRes
      ] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getEmployeesByDepartment(),
        dashboardApi.getEmployeesByPosition(),
        dashboardApi.getSalaryTrend(6),
        dashboardApi.getTopEmployees(10),
        salaryApi.getTop(currentMonth, currentYear, 5),
        dashboardApi.getRecentActivities(10)
      ]);

      // Set stats cards
      if (statsRes.success && statsRes.data) {
        const data = statsRes.data;
        setStats([
          {
            title: 'Tổng nhân viên',
            value: data.tongNhanVien || 0,
            change: `${data.nhanVienMoi || 0} nhân viên mới tháng này`,
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
            change: `${data.tongNhanVien - data.daChamCong} chưa chấm công`,
            changeType: data.daChamCong >= data.tongNhanVien * 0.8 ? 'positive' : 'negative',
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
            change: `${data.nghiPhepHomNay || 0} người nghỉ hôm nay`,
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
            value: formatCurrency(data.tongLuongThang || 0),
            change: `${data.hopDongSapHetHan || 0} hợp đồng sắp hết hạn`,
            changeType: data.hopDongSapHetHan > 0 ? 'negative' : 'positive',
            icon: (
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: '#8b5cf6',
          },
        ]);
      }

      // Set other data
      if (deptRes.success) setEmployeesByDept(deptRes.data || []);
      if (posRes.success) setEmployeesByPos(posRes.data || []);
      if (salaryRes.success) setSalaryTrend(salaryRes.data || []);
      if (topRes.success) setTopEmployees(topRes.data || []);
      if (topSalaryRes.success) setTopSalaries(topSalaryRes.data || []);
      if (activitiesRes.success) setRecentActivities(activitiesRes.data || []);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_employee':
        return '👤';
      case 'leave_request':
        return '📅';
      case 'new_contract':
        return '📄';
      default:
        return '📌';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
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

      {/* Stats Cards */}
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
        {/* Nhân viên theo phòng ban */}
        <Card title="Nhân viên theo phòng ban" className="dashboard-card">
          <div className="department-list">
            {employeesByDept.slice(0, 5).map((dept, index) => (
              <div key={index} className="department-item">
                <div className="department-info">
                  <div className="department-name">{dept.ten_phong}</div>
                  <div className="department-count">{dept.so_luong} nhân viên</div>
                </div>
                <div className="department-bar">
                  <div 
                    className="department-bar-fill" 
                    style={{ 
                      width: `${(dept.so_luong / Math.max(...employeesByDept.map(d => d.so_luong))) * 100}%`,
                      background: `linear-gradient(135deg, #667eea, #764ba2)`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top nhân viên chăm chỉ */}
        <Card title="Top 5 nhân viên chăm chỉ" className="dashboard-card">
          <div className="top-employees-list">
            {topEmployees.slice(0, 5).map((emp, index) => (
              <div key={index} className="top-employee-item">
                <div className={`top-rank rank-${index + 1}`}>#{index + 1}</div>
                <div className="top-employee-avatar" style={{
                  background: ['#667eea', '#f093fb', '#4facfe', '#fa709a', '#30cfd0'][index]
                }}>
                  {emp.ten_nv?.charAt(0).toUpperCase()}
                </div>
                <div className="top-employee-info">
                  <div className="top-employee-name">{emp.ten_nv}</div>
                  <div className="top-employee-dept">{emp.ten_phong}</div>
                </div>
                <div className="top-employee-hours">
                  {Math.round(emp.tong_gio)} giờ
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top nhân viên lương cao nhất */}
        <Card title="Top 5 nhân viên lương cao nhất" className="dashboard-card">
          <div className="top-employees-list">
            {topSalaries.slice(0, 5).map((emp, index) => (
              <div key={index} className="top-employee-item top-salary-item">
                <div className={`top-rank rank-${index + 1}`}>#{index + 1}</div>
                <div className="top-employee-avatar" style={{
                  background: ['#FFD700', '#C0C0C0', '#CD7F32', '#667eea', '#f093fb'][index]
                }}>
                  {emp.ten_nv?.charAt(0).toUpperCase()}
                </div>
                <div className="top-employee-info">
                  <div className="top-employee-name">{emp.ten_nv}</div>
                  <div className="top-employee-dept">{emp.ten_phong}</div>
                </div>
                <div className="top-employee-salary">
                  {formatCurrency(emp.luong_thuc_nhan)}
                </div>
              </div>
            ))}
            {topSalaries.length === 0 && (
              <p className="empty-message">Chưa có dữ liệu lương tháng này</p>
            )}
          </div>
        </Card>

        {/* Xu hướng lương 6 tháng */}
        <Card title="Xu hướng lương 6 tháng gần nhất" className="dashboard-card dashboard-card-full">
          <div className="salary-chart">
            {salaryTrend.map((item, index) => {
              const maxSalary = Math.max(...salaryTrend.map(s => s.tong_luong));
              const height = (item.tong_luong / maxSalary) * 200;
              
              return (
                <div key={index} className="salary-bar-wrapper">
                  <div className="salary-bar-container">
                    <div 
                      className="salary-bar" 
                      style={{ height: `${height}px` }}
                      title={formatCurrency(item.tong_luong)}
                    />
                  </div>
                  <div className="salary-label">
                    T{item.thang}/{item.nam}
                  </div>
                  <div className="salary-value">
                    {formatCurrency(item.tong_luong)}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Hoạt động gần đây */}
        <Card title="Hoạt động gần đây" className="dashboard-card dashboard-card-full">
          <div className="activities-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {getActivityIcon(activity.loai)}
                </div>
                <div className="activity-content">
                  <div className="activity-text">{activity.mo_ta}</div>
                  <div className="activity-time">{formatDate(activity.ngay)}</div>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <p className="empty-message">Chưa có hoạt động nào</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;