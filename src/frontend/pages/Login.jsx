import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";   // từ /frontend/pages sang /frontend/styles

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");

  // Nếu đã có token thì không cho vào lại trang login
  useEffect(() => {
    if (localStorage.getItem("token")) nav("/", { replace: true });
  }, [nav]);

  const submit = (e) => {
    e.preventDefault();
    if (form.username === "admin" && form.password === "123456") {
      localStorage.setItem("token", "demo-token");
      nav("/", { replace: true });
    } else {
      setErr("Sai tài khoản hoặc mật khẩu (demo: admin / 123456)");
    }
  };

  return (
    <div className="login-page">
      {/* BÊN TRÁI: ẢNH CÔNG TY + GIỚI THIỆU */}
      <div className="login-left">
        <div className="login-banner">
          <img
            src="/images/company-login.jpg"
            alt="Công ty"
            className="login-banner-img"
          />
        </div>
        <div className="login-left-content">
          <h1>Hệ thống quản lý nhân viên</h1>
          <p>
            Hỗ trợ quản lý thông tin nhân viên, phòng ban, chấm công, tính lương
            và báo cáo một cách nhanh chóng, chính xác.
          </p>
          <ul>
            <li>Theo dõi hồ sơ và hợp đồng nhân viên.</li>
            <li>Chấm công, quản lý ngày nghỉ, làm thêm giờ.</li>
            <li>Tự động tính lương dựa trên giờ làm thực tế.</li>
          </ul>
        </div>
      </div>

      {/* BÊN PHẢI: FORM ĐĂNG NHẬP */}
      <div className="login-right">
        <div className="login-box">
          <h2>Đăng nhập</h2>
          <p className="login-sub">
            Vui lòng sử dụng tài khoản do quản trị cấp.
            <br />
            <span>(Demo: tài khoản <b>admin</b> – mật khẩu <b>123456</b>)</span>
          </p>

          <form onSubmit={submit} className="login-form">
            <div className="login-field">
              <label>Tài khoản</label>
              <input
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            <div className="login-field">
              <label>Mật khẩu</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Nhập mật khẩu"
              />
            </div>

            {err && <div className="login-error">{err}</div>}

            <button type="submit" className="login-button">
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
