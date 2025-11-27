import React from 'react';
import { Users, Building, Calendar, DollarSign } from 'lucide-react';

const Dashboard = ({ emps, depts, leaves }) => {
  const stats = [
    { label: 'Tổng Nhân Viên', val: emps.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Phòng Ban', val: depts.length, icon: Building, color: 'bg-indigo-500' },
    { label: 'Đơn Nghỉ Phép', val: leaves.length, icon: Calendar, color: 'bg-orange-500' },
    { label: 'Lương Tháng (Dự kiến)', val: '23.0M', icon: DollarSign, color: 'bg-green-500' },
  ];

  return (
    <div className="p-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 transition hover:shadow-md">
            <div className={`p-3 rounded-lg ${s.color} text-white`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800">{s.val}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border h-64 flex items-center justify-center text-gray-400 bg-gray-50">
            Biểu đồ biến động nhân sự (Chart Placeholder)
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border h-64 flex items-center justify-center text-gray-400 bg-gray-50">
            Biểu đồ chi phí lương (Chart Placeholder)
         </div>
      </div>
    </div>
  );
};

export default Dashboard;