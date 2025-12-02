import React, { useState, useEffect } from 'react';
import { positionApi } from '../../api/positionApi';
import { Position } from '../../types';
import Table from '../../components/common/Table';
import Card from '../../components/common/Card';
import './Positions.css';

const PositionList: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      setLoading(true);
      const response = await positionApi.getAll();
      if (response.success && response.data) {
        setPositions(response.data);
      }
    } catch (error) {
      console.error('Failed to load positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'ma_chuc_vu',
      title: 'Mã chức vụ',
      width: '150px',
    },
    {
      key: 'ten_chuc_vu',
      title: 'Tên chức vụ',
    },
    {
      key: 'so_nhan_vien',
      title: 'Số nhân viên',
      width: '150px',
      align: 'center' as const,
      render: (value: number) => value || 0,
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý chức vụ</h1>
          <p className="page-subtitle">Danh sách tất cả chức vụ trong công ty</p>
        </div>
      </div>

      <Card>
        <Table
          columns={columns}
          data={positions}
          loading={loading}
          rowKey="ma_chuc_vu"
          emptyText="Không có chức vụ nào"
        />
      </Card>
    </div>
  );
};

export default PositionList;