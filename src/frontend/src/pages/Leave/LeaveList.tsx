import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveApi } from '../../api/leaveApi';
import { Leave } from '../../types';
import Table from '../../components/common/Table';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';
import './Leave.css';

const LeaveList: React.FC = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const response = await leaveApi.getAll({ page: 1, limit: 100 });
      if (response.success && response.data) {
        setLeaves(response.data);
      }
    } catch (error) {
      console.error('Failed to load leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    if (window.confirm('Duyệt đơn nghỉ phép này?')) {
      try {
        await leaveApi.updateStatus(id, 'Đã duyệt');
        loadLeaves();
      } catch (error) {
        console.error('Failed to approve leave:', error);
      }
    }
  };

  const handleReject = async (id: number) => {
    if (window.confirm('Từ chối đơn nghỉ phép này?')) {
      try {
        await leaveApi.updateStatus(id, 'Từ chối');
        loadLeaves();
      } catch (error) {
        console.error('Failed to reject leave:', error);
      }
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
      key: 'loai_phep',
      title: 'Loại phép',
      width: '120px',
    },
    {
      key: 'ngay_bat_dau',
      title: 'Từ ngày',
      width: '120px',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'ngay_ket_thuc',
      title: 'Đến ngày',
      width: '120px',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'so_ngay',
      title: 'Số ngày',
      width: '100px',
      align: 'center' as const,
    },
    {
      key: 'trang_thai',
      title: 'Trạng thái',
      width: '120px',
      align: 'center' as const,
      render: (value: string) => {
        let className = 'status-pending';
        if (value === 'Đã duyệt') className = 'status-approved';
        if (value === 'Từ chối') className = 'status-rejected';
        
        return (
          <span className={`status-badge ${className}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '150px',
      align: 'center' as const,
      render: (_: any, record: Leave) => {
        if (record.trang_thai !== 'Chờ duyệt') return null;
        
        return (
          <div className="action-buttons">
            <button
              className="action-btn action-btn-approve"
              onClick={() => handleApprove(record.id)}
              title="Duyệt"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              className="action-btn action-btn-reject"
              onClick={() => handleReject(record.id)}
              title="Từ chối"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý nghỉ phép</h1>
          <p className="page-subtitle">Danh sách yêu cầu nghỉ phép</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/leave/request')}
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Đăng ký nghỉ phép
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={leaves}
          loading={loading}
          rowKey="id"
          emptyText="Không có yêu cầu nào"
        />
      </Card>
    </div>
  );
};

export default LeaveList;