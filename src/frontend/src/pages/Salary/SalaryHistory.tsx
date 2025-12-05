import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { salaryApi } from '../../api/salaryApi';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './Salary.css';

interface SalaryRecord {
  id: number;
  thang: number;
  nam: number;
  tong_gio: number;
  luong_co_ban_thoi_diem: number;
  luong_them: number;
  tru_luong: number;
  luong_thuc_nhan: number;
  ngay_tinh: string;
  ghi_chu?: string;
}

const SalaryHistory: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [salaryHistory, setSalaryHistory] = useState<SalaryRecord[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    highest: 0,
    lowest: 0
  });

  useEffect(() => {
    if (user?.ma_nv) {
      loadSalaryHistory();
    }
  }, [user, selectedYear]);

  const loadSalaryHistory = async () => {
    if (!user?.ma_nv) return;

    try {
      setLoading(true);
      // Use getByEmployee API instead of getEmployeeSalary
      const response = await salaryApi.getByEmployee(user.ma_nv, undefined, selectedYear);
      
      if (response.success && response.data) {
        // ✅ FIX: Map data với field snapshot từ DB
        const mapped: SalaryRecord[] = response.data.map((s) => ({
          id: s.id,
          thang: s.thang,
          nam: s.nam,
          tong_gio: s.tong_gio,
          // ✅ CRITICAL: Dùng luong_co_ban_thoi_diem (snapshot) thay vì luong_co_ban
          luong_co_ban_thoi_diem: s.luong_co_ban_thoi_diem || s.luong_co_ban || 0,
          luong_them: s.luong_them,
          tru_luong: s.tru_luong || 0,
          luong_thuc_nhan: s.luong_thuc_nhan,
          ngay_tinh: s.ngay_tinh,
          ghi_chu: s.ghi_chu,
          trang_thai: s.trang_thai
        }));

        setSalaryHistory(mapped);
        calculateStats(mapped);
      }
    } catch (error) {
      console.error('Failed to load salary history:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: SalaryRecord[]) => {
    if (data.length === 0) {
      setStats({ total: 0, average: 0, highest: 0, lowest: 0 });
      return;
    }

    const salaries = data.map(s => s.luong_thuc_nhan);
    const total = salaries.reduce((sum, s) => sum + s, 0);
    const average = total / salaries.length;
    const highest = Math.max(...salaries);
    const lowest = Math.min(...salaries);

    setStats({ total, average, highest, lowest });
  };

  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  if (loading) {
    return <Loading text="Đang tải lịch sử lương..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">💰 Lịch sử lương</h1>
          <p className="page-subtitle">Xem chi tiết lương các tháng của bạn</p>
        </div>

        <div className="year-selector">
          <label>Năm: </label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="year-select"
          >
            {getAvailableYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Salary History List */}
      <div className="salary-history-list">
        {salaryHistory.length === 0 ? (
          <Card>
            <div className="empty-state">
              <div className="empty-icon">💰</div>
              <p>Chưa có dữ liệu lương năm {selectedYear}</p>
            </div>
          </Card>
        ) : (
          salaryHistory.map((salary) => (
            <Card key={salary.id} className="salary-card" hoverable>
              <div className="salary-card-header">
                <div className="salary-month-badge">
                  Tháng {salary.thang}/{salary.nam}
                </div>
                <div className="salary-amount-large">
                  {formatCurrency(salary.luong_thuc_nhan)}
                </div>
              </div>

              <div className="salary-card-body">
                <div className="salary-detail-row">
                  <span className="salary-detail-label">
                    <span className="detail-icon">💵</span>
                    Lương cơ bản
                  </span>
                  <span className="salary-detail-value">
                    {formatCurrency(salary.luong_co_ban_thoi_diem)}
                  </span>
                </div>

                <div className="salary-detail-row">
                  <span className="salary-detail-label">
                    <span className="detail-icon">⏰</span>
                    Tổng giờ làm
                  </span>
                  <span className="salary-detail-value">
                    {salary.tong_gio}h
                  </span>
                </div>

                {salary.luong_them > 0 && (
                  <div className="salary-detail-row bonus">
                    <span className="salary-detail-label">
                      <span className="detail-icon">✨</span>
                      Thưởng thêm giờ
                    </span>
                    <span className="salary-detail-value positive">
                      +{formatCurrency(salary.luong_them)}
                    </span>
                  </div>
                )}

                {salary.tru_luong > 0 && (
                  <div className="salary-detail-row deduction">
                    <span className="salary-detail-label">
                      <span className="detail-icon">⚠️</span>
                      Trừ lương
                    </span>
                    <span className="salary-detail-value negative">
                      -{formatCurrency(salary.tru_luong)}
                    </span>
                  </div>
                )}

                {salary.ghi_chu && (
                  <div className="salary-note">
                    <span className="note-icon">💬</span>
                    {salary.ghi_chu}
                  </div>
                )}
              </div>

              <div className="salary-card-footer">
                <span className="salary-date">
                  📅 Ngày tính: {formatDate(salary.ngay_tinh)}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SalaryHistory;