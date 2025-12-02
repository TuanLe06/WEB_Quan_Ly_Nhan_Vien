import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeApi } from '../../api/employeeApi';
import { Employee } from '../../types';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import './Employees.css';

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; ma_nv: string | null }>({
    show: false,
    ma_nv: null,
  });

  useEffect(() => {
    loadEmployees();
  }, [search]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeApi.getAll({ page: 1, limit: 100, search });
      if (response.success && response.data) {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.ma_nv) return;
    
    try {
      await employeeApi.delete(deleteModal.ma_nv);
      setDeleteModal({ show: false, ma_nv: null });
      loadEmployees();
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  const getStatusBadge = (status: number) => {
    return status === 1 ? 'ACTIVE' : 'INACTIVE';
  };

  const columns = [
    {
      key: 'ma_nv',
      title: 'Mã NV',
      width: '100px',
    },
    {
      key: 'ten_nv',
      title: 'Họ và tên',
      render: (value: string, record: Employee) => (
        <div className="employee-info">
          <div className="employee-avatar-sm">
            {value.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="employee-name">{value}</div>
            <div className="employee-email">{record.gioi_tinh}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'ten_phong',
      title: 'Phòng ban',
      width: '150px',
    },
    {
      key: 'ten_chuc_vu',
      title: 'Chức vụ',
      width: '150px',
    },
    {
      key: 'trang_thai',
      title: 'Trạng thái',
      width: '120px',
      align: 'center' as const,
      render: (value: number) => (
        <span className={`status-badge status-${getStatusBadge(value).toLowerCase()}`}>
          {getStatusBadge(value)}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '150px',
      align: 'center' as const,
      render: (_: any, record: Employee) => (
        <div className="action-buttons">
          <button
            className="action-btn action-btn-view"
            onClick={() => navigate(`/employees/${record.ma_nv}`)}
            title="Xem chi tiết"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            className="action-btn action-btn-edit"
            onClick={() => navigate(`/employees/${record.ma_nv}/edit`)}
            title="Chỉnh sửa"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            className="action-btn action-btn-delete"
            onClick={() => setDeleteModal({ show: true, ma_nv: record.ma_nv })}
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
          <h1 className="page-title">Quản lý nhân viên</h1>
          <p className="page-subtitle">Danh sách tất cả nhân viên trong hệ thống</p>
        </div>
      </div>

      <Card>
        <div className="table-toolbar">
          <Input
            placeholder="Tìm kiếm nhân viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
          <Button
            variant="primary"
            onClick={() => navigate('/employees/new')}
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Thêm nhân viên
          </Button>
        </div>

        <Table
          columns={columns}
          data={employees}
          loading={loading}
          rowKey="ma_nv"
          emptyText="Không có nhân viên nào"
        />
      </Card>

      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, ma_nv: null })}
        title="Xác nhận xóa"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ show: false, ma_nv: null })}
            >
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Xóa
            </Button>
          </>
        }
      >
        <p>Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default EmployeeList;