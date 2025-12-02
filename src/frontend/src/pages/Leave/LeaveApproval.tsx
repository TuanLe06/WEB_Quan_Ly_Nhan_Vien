import React from 'react';
import Card from '../../components/common/Card';

const LeaveApproval: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Duyệt nghỉ phép</h1>
      </div>
      <Card>
        <p>Trang duyệt nghỉ phép (sử dụng LeaveList với filter)</p>
      </Card>
    </div>
  );
};

export default LeaveApproval;