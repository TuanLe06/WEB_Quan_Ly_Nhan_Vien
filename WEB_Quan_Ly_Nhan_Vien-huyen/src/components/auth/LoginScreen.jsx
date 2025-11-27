import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { DATA } from '../../data/mockData'; 

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Logic giả lập check login
    const user = DATA.employees.find(u => u.ma_nv === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Sai mã nhân viên hoặc mật khẩu (Thử: PDTT0001 / 123)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">HRM System</h2>
          <p className="text-gray-500 text-sm">Đăng nhập hệ thống</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã Nhân Viên</label>
            <input 
              value={username} onChange={e => setUsername(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="VD: PDTT0001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật Khẩu</label>
            <input 
              type="password"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="******"
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition">
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;