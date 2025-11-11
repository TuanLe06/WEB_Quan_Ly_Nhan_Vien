import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

const employees = [
  { id:"PDT0001", name:"Nguyễn An", deptId:1, position:"T", baseSalary:4000000 },
  { id:"PCT0001", name:"Trần Bình", deptId:2, position:"N", baseSalary:3800000 },
];
const attendance = [
  { empId:"PDT0001", month:"2025-11", hours:45 },
  { empId:"PDT0001", month:"2025-10", hours:39 },
  { empId:"PCT0001", month:"2025-11", hours:38 },
];

function calc(base, hours){
  const over = Math.max(0, hours-40);
  const overtime = over * (base/40) * 1.5;
  const total = hours<=40 ? base : base + overtime;
  return { overtime, total };
}

export default function EmployeeDetail(){
  const { id } = useParams();
  const emp = employees.find(e=>e.id===id) || employees[0];
  const [month, setMonth] = useState(new Date().toISOString().slice(0,7));
  const hours = useMemo(()=> attendance.find(a=>a.empId===emp.id && a.month===month)?.hours ?? 0, [emp.id, month]);
  const sal = calc(emp.baseSalary, hours);

  const history = attendance.filter(a=>a.empId===emp.id).sort((a,b)=>b.month.localeCompare(a.month));

  return (
    <div>
      <Link to="/employees">← Quay lại</Link>
      <h2>Chi tiết nhân viên</h2>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div style={{ padding:12, border:"1px solid #eee", borderRadius:8 }}>
          <h3>Hồ sơ</h3>
          <p><b>Mã NV:</b> {emp.id}</p>
          <p><b>Họ tên:</b> {emp.name}</p>
          <p><b>Phòng ban ID:</b> {emp.deptId}</p>
          <p><b>Chức vụ:</b> {emp.position}</p>
          <p><b>Lương cơ bản:</b> {emp.baseSalary.toLocaleString("vi-VN")} đ</p>
        </div>
        <div style={{ padding:12, border:"1px solid #eee", borderRadius:8 }}>
          <h3>Lương tháng</h3>
          <label>Tháng
            <input type="month" value={month} onChange={e=>setMonth(e.target.value)}
                   style={{ display:"block", marginTop:6, marginBottom:10 }}/>
          </label>
          <p><b>Giờ làm:</b> {hours} giờ</p>
          <p><b>Làm thêm:</b> {sal.overtime.toLocaleString("vi-VN")} đ</p>
          <p><b>Tổng lương:</b> {sal.total.toLocaleString("vi-VN")} đ</p>
        </div>
      </div>

      <h3>Lịch sử chấm công</h3>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead><tr><th>Tháng</th><th>Giờ</th></tr></thead>
        <tbody>
          {history.map((h,i)=>(
            <tr key={i} style={{ borderTop:"1px solid #eee" }}>
              <td>{h.month}</td><td>{h.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
