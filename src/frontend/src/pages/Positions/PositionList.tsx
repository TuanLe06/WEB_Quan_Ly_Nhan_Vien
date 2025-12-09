import React, { useState, useEffect } from 'react';
import { positionApi } from '../../api/positionApi';
import { Position } from '../../types';
import Table from '../../components/common/Table';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import './Positions.css';

const PositionList: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [formData, setFormData] = useState({
    ma_chuc_vu: '',
    ten_chuc_vu: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      alert('Không thể tải danh sách chức vụ');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (position?: Position) => {
    if (position) {
      // Edit mode
      setEditingPosition(position);
      setFormData({
        ma_chuc_vu: position.ma_chuc_vu,
        ten_chuc_vu: position.ten_chuc_vu
      });
    } else {
      // Create mode
      setEditingPosition(null);
      setFormData({
        ma_chuc_vu: '',
        ten_chuc_vu: ''
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPosition(null);
    setFormData({ ma_chuc_vu: '', ten_chuc_vu: '' });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.ten_chuc_vu.trim()) {
      setError('Vui lòng nhập tên chức vụ');
      return;
    }

    if (!editingPosition && !formData.ma_chuc_vu.trim()) {
      setError('Vui lòng nhập mã chức vụ');
      return;
    }

    if (!editingPosition && formData.ma_chuc_vu.length !== 1) {
      setError('Mã chức vụ phải có đúng 1 ký tự');
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingPosition) {
        // Update
        const response = await positionApi.update(
          editingPosition.ma_chuc_vu,
          { ten_chuc_vu: formData.ten_chuc_vu }
        );
        
        if (response.success) {
          alert('Cập nhật chức vụ thành công');
          handleCloseModal();
          loadPositions();
        }
      } else {
        // Create
        const response = await positionApi.create({
          ma_chuc_vu: formData.ma_chuc_vu,
          ten_chuc_vu: formData.ten_chuc_vu
        });
        
        if (response.success) {
          alert('Thêm chức vụ thành công');
          handleCloseModal();
          loadPositions();
        }
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      const message = error.response?.data?.message || 'Có lỗi xảy ra';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (position: Position) => {
    if (!window.confirm(
      `Bạn có chắc muốn xóa chức vụ "${position.ten_chuc_vu}"?\n` +
      `${position.so_nhan_vien || 0} nhân viên đang giữ chức vụ này.`
    )) {
      return;
    }

    try {
      const response = await positionApi.delete(position.ma_chuc_vu);
      
      if (response.success) {
        alert('Xóa chức vụ thành công');
        loadPositions();
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      const message = error.response?.data?.message || 'Không thể xóa chức vụ';
      alert(message);
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
    {
      key: 'actions',
      title: 'Thao tác',
      width: '180px',
      align: 'center' as const,
      render: (_: any, record: Position) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenModal(record)}
          >
            Sửa
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý chức vụ</h1>
          <p className="page-subtitle">Danh sách tất cả chức vụ trong công ty</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          + Thêm chức vụ
        </Button>
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

      {/* Modal Form */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingPosition ? 'Cập nhật chức vụ' : 'Thêm chức vụ mới'}
        >
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '12px',
                marginBottom: '16px',
                background: '#fee',
                color: '#c33',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Mã chức vụ <span style={{ color: 'red' }}>*</span>
              </label>
              <Input
                value={formData.ma_chuc_vu}
                onChange={(e) => setFormData({ ...formData, ma_chuc_vu: e.target.value })}
                placeholder="Nhập mã chức vụ (1 ký tự)"
                maxLength={1}
                disabled={!!editingPosition}
                required
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                Mã chức vụ phải có đúng 1 ký tự (VD: A, B, C...)
              </small>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Tên chức vụ <span style={{ color: 'red' }}>*</span>
              </label>
              <Input
                value={formData.ten_chuc_vu}
                onChange={(e) => setFormData({ ...formData, ten_chuc_vu: e.target.value })}
                placeholder="Nhập tên chức vụ"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={submitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Đang xử lý...' : (editingPosition ? 'Cập nhật' : 'Thêm mới')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PositionList;