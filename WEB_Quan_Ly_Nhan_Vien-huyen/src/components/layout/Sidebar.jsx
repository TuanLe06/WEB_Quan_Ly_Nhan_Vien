import React from 'react';
import { Users, BarChart3, Clock, Calendar, DollarSign, LogOut, Briefcase } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, currentUser, onLogout }) => {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold flex items-center gap-2"><Briefcase/> HR Manager</h1>
        <p className="text-xs text-slate-400 mt-2">Xin chào, {currentUser.ten_nv}</p>
      </div>
      
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}><BarChart3 size={20}/> Tổng Quan</button>
        <button onClick={() => setActiveTab('timekeeping')} className={`w-full flex items-center gap-3 px-4 py-3 rounded ${activeTab === 'timekeeping' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}><Clock size={20}/> Chấm Công</button>
        <button onClick={() => setActiveTab('leaves')} className={`w-full flex items-center gap-3 px-4 py-3 rounded ${activeTab === 'leaves' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}><Calendar size={20}/> Nghỉ Phép</button>
        
        {/* Menu chỉ dành cho Admin */}
        {currentUser.role === 'admin' && (
          <>
            <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase mt-4">Quản Trị</div>
            <button onClick={() => setActiveTab('employees')} className={`w-full flex items-center gap-3 px-4 py-3 rounded ${activeTab === 'employees' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}><Users size={20}/> Nhân Viên</button>
            <button onClick={() => setActiveTab('payroll')} className={`w-full flex items-center gap-3 px-4 py-3 rounded ${activeTab === 'payroll' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}><DollarSign size={20}/> Tính Lương</button>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button onClick={onLogout} className="w-full flex items-center gap-2 text-red-400 hover:text-red-300"><LogOut size={20}/> Đăng Xuất</button>
      </div>
    </div>
  );
};

export default Sidebar;