import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const deptMap = { 1:{ code:"PDT", name:"Phòng Đào tạo" }, 2:{ code:"PCT", name:"Phòng Công tác" } };
const seed = [
  { id:"PDT0001", name:"Nguyễn An", deptId:1, position:"T", baseSalary:4000000 },
  { id:"PCT0001", name:"Trần Bình", deptId:2, position:"N", baseSalary:3800000 },
];

function PosBadge({ code }) {
  const text = code==="T"?"Trưởng phòng":code==="P"?"Phó phòng":"Nhân viên";
  const bg = code==="T"?"#0ea5e9":code==="P"?"#10b981":"#6b7280";
  return <span style={{ background:bg, color:"#fff", padding:"2px 8px", borderRadius:999, fontSize:12 }}>{text}</span>;
}

export default function EmployeeList() {
  const [rows, setRows] = useState(seed);
  const [q, setQ] = useState("");

  const filtered = useMemo(()=>{
    const s=q.trim().toLowerCase();
    if(!s) return rows;
    return rows.filter(r=>
      [r.id,r.name,deptMap[r.deptId]?.code,deptMap[r.deptId]?.name].some(x=>String(x).toLowerCase().includes(s))
    );
  },[q,rows]);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2>Nhân viên</h2>
        <input placeholder="Tìm theo mã, tên, phòng ban…" value={q} onChange={e=>setQ(e.target.value)}
               style={{ padding:8, border:"1px solid #ccc", borderRadius:8, minWidth:260 }}/>
      </div>

      <table style={{ width:"100%", borderCollapse:"collapse", marginTop:10 }}>
        <thead><tr>
          <th>Mã NV</th><th>Họ tên</th><th>Phòng ban</th><th>Chức vụ</th><th>Lương cơ bản</th><th></th>
        </tr></thead>
        <tbody>
          {filtered.map(r=>(
            <tr key={r.id} style={{ borderTop:"1px solid #eee" }}>
              <td><Link to={`/employees/${r.id}`} style={{ color:"#111" }}>{r.id}</Link></td>
              <td>{r.name}</td>
              <td><b>{deptMap[r.deptId]?.code}</b><div style={{ fontSize:12, color:"#6b7280" }}>{deptMap[r.deptId]?.name}</div></td>
              <td><PosBadge code={r.position}/></td>
              <td>{r.baseSalary.toLocaleString("vi-VN")} đ</td>
              <td>
                <button onClick={()=>setRows(prev=>prev.filter(x=>x.id!==r.id))}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop:8, color:"#6b7280" }}>
        Trang thêm/sửa có thể dùng <code>/employees/new</code> hoặc tái sử dụng <b>EmployeeForm.jsx</b>.
      </p>
    </div>
  );
}
