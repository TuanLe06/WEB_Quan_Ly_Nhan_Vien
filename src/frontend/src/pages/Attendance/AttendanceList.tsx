import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { Attendance } from '../../types';
import Table from '../../components/common/Table';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatTime } from '../../utils/formatters';
import './Attendance.css';

const AttendanceList: React.FC = () => {
  const navigate = useNavigate();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendances();
  }, []);

  const loadAttendances = async () => {
    try {
      setLoading(true);
      const response = await attendanceApi.getToday();
      if (response.success && response.data) {
        setAttendances(response.data);
      }
    } catch (error) {
      console.error('Failed to load attendances:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'ma_nv',
      title: 'Mã NV',
      width: '100px',
    },
    {
      key: 'ten_nv',
      title: 'Họ tên',
    },
    {
      key: 'ngay_lam',
      title: 'Ngày',
      width: '120px',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'gio_vao',
      title: 'Giờ vào',
      width: '100px',
      align: 'center' as const,
      render: (value: string) => formatTime(value),
    },
    {
      key: 'gio_ra',
      title: 'Giờ ra',
      width: '100px',
      align: 'center' as const,
      render: (value: string | null) => value ? formatTime(value) : '-',
    },
    {
      key: 'so_gio',
      title: 'Số giờ',
      width: '100px',
      align: 'center' as const,
      render: (value: number) => `${value.toFixed(1)}h`,
    },
    {
      key: 'trang_thai',
      title: 'Trạng thái',
      width: '120px',
      align: 'center' as const,
      render: (value: string) => (
        <span className={`status-badge status-${value?.toLowerCase()}`}>
          {value || 'Đúng giờ'}
        </span>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Chấm công hôm nay</h1>
          <p className="page-subtitle">Danh sách chấm công ngày {formatDate(new Date().toISOString())}</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/attendance/check')}
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          Chấm công
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={attendances}
          loading={loading}
          rowKey="id"
          emptyText="Chưa có ai chấm công hôm nay"
        />
      </Card>
    </div>
  );
};

export default AttendanceList;