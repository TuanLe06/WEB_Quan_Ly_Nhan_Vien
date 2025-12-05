import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import './ErrorPage.css';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-content">
        <div className="error-icon">
          <svg width="120" height="120" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="error-title">403 - Không có quyền truy cập</h1>
        
        <p className="error-message">
          Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.
        </p>
        
        <div className="error-actions">
          <Button variant="primary" onClick={() => navigate(-1)}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </Button>
          
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;