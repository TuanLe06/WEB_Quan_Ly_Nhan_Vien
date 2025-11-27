import React from 'react';

const Header = ({ activeTab, currentUser }) => {
  const getTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Tổng Quan Hệ Thống';
      case 'timekeeping': return 'Chấm Công & Giờ Làm';
      case 'leaves': return 'Quản Lý Nghỉ Phép';
      case 'employees': return 'Quản Lý Nhân Sự (Admin)';
      case 'payroll': return 'Tính Lương & Phúc Lợi (Admin)';
      default: return 'HR Manager';
    }
  };

  return (
    <header className="bg-white h-16 border-b shadow-sm flex items-center px-6 justify-between sticky top-0 z-10">
      <h2 className="font-bold text-xl text-gray-800">{getTitle()}</h2>
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
          {currentUser.role === 'admin' ? 'Quản Trị Viên' : 'Nhân Viên'}
        </span>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          {currentUser.ten_nv.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Header;