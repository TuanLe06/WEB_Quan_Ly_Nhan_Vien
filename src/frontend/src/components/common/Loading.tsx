import React from 'react';
import './common.css';

interface LoadingProps {
  text?: string;
  fullscreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ text = 'Đang tải...', fullscreen = false }) => {
  if (fullscreen) {
    return (
      <div className="loading-fullscreen">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className="spinner"></div>
      <span className="loading-text">{text}</span>
    </div>
  );
};

export default Loading;