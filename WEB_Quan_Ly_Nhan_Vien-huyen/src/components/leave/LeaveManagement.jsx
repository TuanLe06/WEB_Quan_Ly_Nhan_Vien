import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

const LeaveManagement = ({ leaves, setLeaves, currentUser }) => {
  const [form, setForm] = useState({ ly_do: '', ngay_bd: '', so_ngay: 1 });

  const handleRequest = (e) => {
    e.preventDefault();
    const newLeave = {
      id: Date.now(),
      ma_nv: currentUser.ma_nv,
      ...form,
      trang_thai: 'Chờ duyệt'
    };
    setLeaves([...leaves, newLeave]);
    setForm({ ly_do: '', ngay_bd: '', so_ngay: 1 });
  };

  const updateStatus = (id, status) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, trang_thai: status } : l));
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form xin nghỉ */}
        <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
          <h3 className="font-bold mb-4 text-gray-800">Tạo đơn xin nghỉ</h3>
          <form onSubmit={handleRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
              <input 
                type="date" required 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={e => setForm({...form, ngay_bd: e.target.value})}
                value={form.ngay_bd}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số ngày nghỉ</label>
              <input 
                type="number" min="1" placeholder="Số ngày" required 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={e => setForm({...form, so_ngay: e.target.value})}
                value={form.so_ngay}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lý do</label>
              <textarea 
                placeholder="Nhập lý do nghỉ..." required rows="3"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={e => setForm({...form, ly_do: e.target.value})}
                value={form.ly_do}
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow">
              Gửi Yêu Cầu
            </button>
          </form>
        </div>

        {/* Danh sách đơn */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
             <h3 className="font-bold text-gray-800">Danh sách đơn nghỉ phép</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 font-semibold text-gray-600">Nhân Viên</th>
                <th className="p-3 font-semibold text-gray-600">Ngày BĐ</th>
                <th className="p-3 font-semibold text-gray-600">Số ngày</th>
                <th className="p-3 font-semibold text-gray-600">Lý do</th>
                <th className="p-3 font-semibold text-gray-600">Trạng thái</th>
                {currentUser.role === 'admin' && <th className="p-3 font-semibold text-gray-600">Duyệt</th>}
              </tr>
            </thead>
            <tbody>
              {leaves.map(l => (
                <tr key={l.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-blue-600">{l.ma_nv}</td>
                  <td className="p-3">{l.ngay_bd}</td>
                  <td className="p-3">{l.so_ngay}</td>
                  <td className="p-3 text-gray-500 italic">{l.ly_do}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      l.trang_thai === 'Đã duyệt' ? 'bg-green-100 text-green-700' : 
                      l.trang_thai === 'Từ chối' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {l.trang_thai}
                    </span>
                  </td>
                  {currentUser.role === 'admin' && l.trang_thai === 'Chờ duyệt' && (
                    <td className="p-3 flex gap-2">
                      <button onClick={() => updateStatus(l.id, 'Đã duyệt')} className="text-green-600 hover:bg-green-50 p-1 rounded"><CheckCircle size={18}/></button>
                      <button onClick={() => updateStatus(l.id, 'Từ chối')} className="text-red-600 hover:bg-red-50 p-1 rounded"><XCircle size={18}/></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;