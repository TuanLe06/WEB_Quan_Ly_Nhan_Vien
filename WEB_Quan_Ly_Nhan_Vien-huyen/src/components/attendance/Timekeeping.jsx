import React from 'react';
import { Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const Timekeeping = ({ logs, setLogs, currentUser }) => {
  const today = new Date().toISOString().split('T')[0];
  const myLog = logs.find(l => l.ma_nv === currentUser.ma_nv && l.ngay === today);

  const handleCheckIn = () => {
    const now = new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
    if (!myLog) {
      setLogs([...logs, { ma_nv: currentUser.ma_nv, ngay: today, gio_vao: now, gio_ra: null }]);
    } else {
      // Check out logic
      setLogs(logs.map(l => 
        (l.ma_nv === currentUser.ma_nv && l.ngay === today) ? { ...l, gio_ra: now } : l
      ));
    }
  };

  return (
    <div className="p-6">
      {/* Khu vực Check-in cá nhân */}
      <div className="bg-white p-8 rounded-xl shadow-sm border mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Xin chào, {currentUser.ten_nv}</h3>
          <p className="text-gray-500">Hôm nay: {formatDate(today)}</p>
        </div>
        
        <div className="flex gap-8 text-center">
          <div>
            <p className="text-sm text-gray-500 mb-1">Giờ vào</p>
            <p className="text-2xl font-mono font-bold text-green-600">{myLog?.gio_vao || '--:--'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Giờ ra</p>
            <p className="text-2xl font-mono font-bold text-orange-600">{myLog?.gio_ra || '--:--'}</p>
          </div>
        </div>

        <button 
          onClick={handleCheckIn}
          className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg transition transform active:scale-95 ${
            !myLog ? 'bg-green-600 hover:bg-green-700' : 
            !myLog.gio_ra ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={myLog && myLog.gio_ra}
        >
          {!myLog ? 'CHECK IN' : !myLog.gio_ra ? 'CHECK OUT' : 'HOÀN THÀNH'}
        </button>
      </div>

      {/* Bảng log */}
      <h3 className="font-bold mb-4 text-gray-700 flex items-center gap-2">
        <Clock className="w-5 h-5"/> Lịch sử chấm công
      </h3>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 font-semibold text-gray-600">Ngày</th>
              {currentUser.role === 'admin' && <th className="p-3 font-semibold text-gray-600">Mã NV</th>}
              <th className="p-3 font-semibold text-gray-600">Giờ Vào</th>
              <th className="p-3 font-semibold text-gray-600">Giờ Ra</th>
            </tr>
          </thead>
          <tbody>
            {logs.filter(l => currentUser.role === 'admin' || l.ma_nv === currentUser.ma_nv).map((l, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3">{formatDate(l.ngay)}</td>
                {currentUser.role === 'admin' && <td className="p-3 font-medium text-blue-600">{l.ma_nv}</td>}
                <td className="p-3 text-green-600 font-mono">{l.gio_vao}</td>
                <td className="p-3 text-orange-600 font-mono">{l.gio_ra || '---'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timekeeping;