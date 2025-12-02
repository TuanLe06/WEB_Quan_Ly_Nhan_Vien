import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contractApi } from '../../api/contractApi';
import { Contract } from '../../types';
import Table from '../../components/common/Table';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import './Contracts.css';

const ContractList: React.FC = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({
    show: false,
    id: null,
  });

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      setLoading(true);
      const response = await contractApi.getAll({ page: 1, limit: 100 });
      if (response.success && response.data) {
        setContracts(response.data);
      }
    } catch (error) {
      console.error('Failed to load contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    try {
      await contractApi.delete(deleteModal.id);
      setDeleteModal({ show: false, id: null });
      loadContracts();
    } catch (error) {
      console.error('Failed to delete contract:', error);
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
      key: 'loai_hop_dong',
      title: 'Loại hợp đồng',
      width: '150px',
    },
    {
      key: 'ngay_bat_dau',
      title: 'Ngày bắt đầu',
      width: '120px',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'ngay_ket_thuc',
      title: 'Ngày kết thúc',
      width: '120px',
      render: (value: string | null) => value ? formatDate(value) : 'Không xác định',
    },
    {
      key: 'con_lai_ngay',
      title: 'Còn lại',
      width: '100px',
      align: 'center' as const,
      render: (value: number) => {
        if (!value) return '-';
        if (value < 0) return <span style={{ color: 'red' }}>Đã hết hạn</span>;
        if (value < 30) return <span style={{ color: 'orange' }}>{value} ngày</span>;
        return `${value} ngày`;
      },
    },
    {
      key: 'trang_thai',
      title: 'Trạng thái',
      width: '120px',
      align: 'center' as const,
      render: (value: string) => (
        <span className={`status-badge status-${value?.toLowerCase()}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '120px',
      align: 'center' as const,
      render: (_: any, record: Contract) => (
        <div className="action-buttons">
          <button
            className="action-btn action-btn-edit"
            onClick={() => navigate(`/contracts/${record.id}/edit`)}
            title="Chỉnh sửa"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            className="action-btn action-btn-delete"
            onClick={() => setDeleteModal({ show: true, id: record.id })}
            title="Xóa"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý hợp đồng</h1>
          <p className="page-subtitle">Danh sách hợp đồng lao động</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/contracts/new')}
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Thêm hợp đồng
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={contracts}
          loading={loading}
          rowKey="id"
          emptyText="Không có hợp đồng nào"
        />
      </Card>

      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        title="Xác nhận xóa"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ show: false, id: null })}
            >
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Xóa
            </Button>
          </>
        }
      >
        <p>Bạn có chắc chắn muốn xóa hợp đồng này? Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default ContractList;