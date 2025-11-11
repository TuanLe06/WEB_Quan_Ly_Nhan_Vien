import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (form.username === "admin" && form.password === "123456") {
      localStorage.setItem("token", "demo-token");
      nav("/");
    } else setErr("Sai tài khoản hoặc mật khẩu (admin / 123456)");
  };

  return (
    <div style={{ maxWidth: 380, margin: "10% auto" }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <label> Tài khoản
          <input value={form.username} onChange={(e)=>setForm({...form,username:e.target.value})}
                 style={{ width:"100%", padding:8, border:"1px solid #ccc", borderRadius:8 }} />
        </label>
        <label> Mật khẩu
          <input type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}
                 style={{ width:"100%", padding:8, border:"1px solid #ccc", borderRadius:8 }} />
        </label>
        {err && <div style={{ color:"crimson" }}>{err}</div>}
        <button style={{ padding:"8px 12px", borderRadius:8, background:"#111", color:"#fff" }}>Đăng nhập</button>
      </form>
    </div>
  );
}
