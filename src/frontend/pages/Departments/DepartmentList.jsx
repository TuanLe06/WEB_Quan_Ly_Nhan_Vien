import { useState } from "react";
import { Link } from "react-router-dom";

const seed = [
  { id: 1, code: "PDT", name: "Phòng Đào tạo", status: "active", year: 2019 },
  { id: 2, code: "PCT", name: "Phòng Công tác", status: "active", year: 2020 },
];

export default function DepartmentList() {
  const [rows, setRows] = useState(seed);
  const [form, setForm] = useState({ id: null, code: "", name: "", year: 2025 });
  const [open, setOpen] = useState(false);

  const save = (e) => {
    e.preventDefault();
    setRows(prev=>{
      if(form.id){ const i = prev.findIndex(x=>x.id===form.id); const arr=[...prev]; arr[i]=form; return arr; }
      const nextId = Math.max(...prev.map(x=>x.id))+1;
      return [...prev, { ...form, id: nextId, status:"active" }];
    });
    setOpen(false); setForm({ id:null, code:"", name:"", year:2025 });
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2>Phòng ban</h2>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setOpen(true)} style={{ padding:"8px 12px", borderRadius:8 }}>+ Thêm</button>
          <Link to="/departments/new">Tới trang DepartmentForm »</Link>
        </div>
      </div>

      <table style={{ width:"100%", borderCollapse:"collapse", marginTop:10 }}>
        <thead><tr>
          <th>ID</th><th>Mã</th><th>Tên</th><th>Trạng thái</th><th>Năm</th><th></th>
        </tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id} style={{ borderTop:"1px solid #eee" }}>
              <td>{r.id}</td><td>{r.code}</td><td>{r.name}</td><td>{r.status}</td><td>{r.year}</td>
              <td>
                <button onClick={()=>{ setForm(r); setOpen(true); }}>Sửa</button>{" "}
                <button onClick={()=>setRows(prev=>prev.filter(x=>x.id!==r.id))}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.35)" }}>
          <div style={{ maxWidth:520, margin:"8% auto", background:"#fff", padding:16, borderRadius:12 }}>
            <h3>{form.id? "Sửa phòng ban":"Thêm phòng ban"}</h3>
            <form onSubmit={save} style={{ display:"grid", gap:10 }}>
              <label>Mã <input value={form.code} onChange={e=>setForm({...form,code:e.target.value})}/></label>
              <label>Tên <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
              <label>Năm <input type="number" value={form.year} onChange={e=>setForm({...form,year:+e.target.value})}/></label>
              <div style={{ display:"flex", gap:8 }}>
                <button type="submit">Lưu</button>
                <button type="button" onClick={()=>setOpen(false)}>Đóng</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

