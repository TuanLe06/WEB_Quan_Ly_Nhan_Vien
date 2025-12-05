import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import './ErrorPage.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-content">
        <div className="error-icon">
          <svg width="120" height="120" fill="none" stroke="#6366f1" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="error-title">404 - Không tìm thấy trang</h1>
        
        <p className="error-message">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
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

export default NotFound;