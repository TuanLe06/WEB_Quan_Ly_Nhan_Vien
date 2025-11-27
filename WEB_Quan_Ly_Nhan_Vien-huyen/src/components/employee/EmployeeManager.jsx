import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const EmployeeManager = ({ emps, setEmps, generateId }) => {
  
  const handleAddDemo = () => {
     // Hàm demo này sẽ được thay thế bằng Modal form nhập liệu chi tiết sau này
     const newId = generateId('PDT', 'N');
     const newEmp = { 
        ma_nv: newId, 
        ten_nv: 'NV Mới (Demo)', 
        ma_phong: 'PDT', 
        ma_chucvu: 'N', 
        luong_cb: 5000000, 
        role: 'user', 
        password: '123' 
     };
     setEmps([...emps, newEmp]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Danh Sách Nhân Viên</h2>
        <button 
          onClick={handleAddDemo} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow transition"
        >
          + Thêm Nhân Viên (Demo)
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Mã Nhân Viên</th>
              <th className="p-4 font-semibold text-gray-600">Họ và Tên</th>
              <th className="p-4 font-semibold text-gray-600">Phòng Ban</th>
              <th className="p-4 font-semibold text-gray-600">Chức Vụ</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Lương Cơ Bản</th>
            </tr>
          </thead>
          <tbody>
            {emps.map((e) => (
              <tr key={e.ma_nv} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4 font-mono font-bold text-blue-600">{e.ma_nv}</td>
                <td className="p-4 font-medium text-gray-800">{e.ten_nv}</td>
                <td className="p-4 text-gray-600">{e.ma_phong}</td>
                <td className="p-4 text-gray-600">{e.ma_chucvu}</td>
                <td className="p-4 text-right font-medium text-green-700">{formatCurrency(e.luong_cb)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeManager;