import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { departmentApi } from '../../api/departmentApi';
import { Department } from '../../types';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import './Departments.css';

const DepartmentList: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; ma_phong: string | null }>({
    show: false,
    ma_phong: null,
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentApi.getAll();
      if (response.success && response.data) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error('Failed to load departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.ma_phong) return;

    try {
      await departmentApi.delete(deleteModal.ma_phong);
      setDeleteModal({ show: false, ma_phong: null });
      loadDepartments();
    } catch (error) {
      console.error('Failed to delete department:', error);
    }
  };

  const columns = [
    {
      key: 'ma_phong',
      title: 'Mã phòng',
      width: '120px',
    },
    {
      key: 'ten_phong',
      title: 'Tên phòng ban',
    },
    {
      key: 'nam_thanh_lap',
      title: 'Năm thành lập',
      width: '150px',
      align: 'center' as const,
    },
    {
      key: 'so_nhan_vien',
      title: 'Số nhân viên',
      width: '150px',
      align: 'center' as const,
      render: (value: number) => value || 0,
    },
    {
      key: 'trang_thai',
      title: 'Trạng thái',
      width: '120px',
      align: 'center' as const,
      render: (value: number) => (
        <span className={`status-badge status-${value === 1 ? 'active' : 'inactive'}`}>
          {value === 1 ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '120px',
      align: 'center' as const,
      render: (_: any, record: Department) => (
        <div className="action-buttons">
          <button
            className="action-btn action-btn-edit"
            onClick={() => navigate(`/departments/${record.ma_phong}/edit`)}
            title="Chỉnh sửa"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            className="action-btn action-btn-delete"
            onClick={() => setDeleteModal({ show: true, ma_phong: record.ma_phong })}
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
          <h1 className="page-title">Quản lý phòng ban</h1>
          <p className="page-subtitle">Danh sách tất cả phòng ban trong công ty</p>
        </div>
      </div>

      <Card>
        <div className="table-toolbar">
          <div></div>
          <Button
            variant="primary"
            onClick={() => navigate('/departments/new')}
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Thêm phòng ban
          </Button>
        </div>

        <Table
          columns={columns}
          data={departments}
          loading={loading}
          rowKey="ma_phong"
          emptyText="Không có phòng ban nào"
        />
      </Card>

      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, ma_phong: null })}
        title="Xác nhận xóa"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ show: false, ma_phong: null })}
            >
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Xóa
            </Button>
          </>
        }
      >
        <p>Bạn có chắc chắn muốn xóa phòng ban này? Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default DepartmentList;