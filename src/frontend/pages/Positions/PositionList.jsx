import { useState } from "react";

const seed = [
  { code:"T", name:"Trưởng phòng", note:"Tổ chức & quản lý" },
  { code:"P", name:"Phó phòng", note:"Hỗ trợ trưởng phòng" },
  { code:"N", name:"Nhân viên", note:"Thực hiện chuyên môn" },
];

export default function PositionList(){
  const [rows, setRows] = useState(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code:"", name:"", note:"" });
  const [editing, setEditing] = useState(null);

  const save = (e)=>{
    e.preventDefault();
    setRows(prev=>{
      const i = prev.findIndex(x=>x.code===form.code);
      if(i>-1){ const arr=[...prev]; arr[i]=form; return arr; }
      return [...prev, form];
    });
    setOpen(false); setEditing(null); setForm({ code:"", name:"", note:"" });
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2>Chức vụ</h2>
        <button onClick={()=>{ setForm({ code:"", name:"", note:"" }); setOpen(true); }}
                style={{ padding:"8px 12px", borderRadius:8 }}>+ Thêm</button>
      </div>

      <table style={{ width:"100%", borderCollapse:"collapse", marginTop:10 }}>
        <thead><tr><th>Mã</th><th>Tên</th><th>Ghi chú</th><th></th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.code} style={{ borderTop:"1px solid #eee" }}>
              <td>{r.code}</td><td>{r.name}</td><td>{r.note}</td>
              <td>
                <button onClick={()=>{ setEditing(r); setForm(r); setOpen(true); }}>Sửa</button>{" "}
                <button onClick={()=>setRows(prev=>prev.filter(x=>x.code!==r.code))}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.35)" }}>
          <div style={{ maxWidth:520, margin:"8% auto", background:"#fff", padding:16, borderRadius:12 }}>
            <h3>{editing? "Sửa chức vụ":"Thêm chức vụ"}</h3>
            <form onSubmit={save} style={{ display:"grid", gap:10 }}>
              <label>Mã (T/P/N)
                <input value={form.code} maxLength={1}
                       onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})}/>
              </label>
              <label>Tên
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
              </label>
              <label>Ghi chú
                <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/>
              </label>
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
