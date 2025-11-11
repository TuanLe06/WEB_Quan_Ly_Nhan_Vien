import { useState } from "react";

export default function EmployeeForm() {
  const [form, setForm] = useState({ id:"", name:"", deptId:1, position:"N", baseSalary:4000000 });

  const submit = (e)=>{
    e.preventDefault();
    alert("Submit demo:\n" + JSON.stringify(form, null, 2));
  };

  return (
    <div style={{ maxWidth:520 }}>
      <h2>Employee Form</h2>
      <form onSubmit={submit} style={{ display:"grid", gap:10 }}>
        <label>Mã NV <input value={form.id} onChange={e=>setForm({...form,id:e.target.value})}/></label>
        <label>Họ tên <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
        <label>Mã phòng ban <input value={form.deptId} onChange={e=>setForm({...form,deptId:Number(e.target.value)})}/></label>
        <label>Chức vụ (T/P/N) <input value={form.position} onChange={e=>setForm({...form,position:e.target.value})}/></label>
        <label>Lương cơ bản <input type="number" value={form.baseSalary} onChange={e=>setForm({...form,baseSalary:Number(e.target.value)})}/></label>
        <button style={{ padding:"8px 12px", borderRadius:8, background:"#111", color:"#fff" }}>Lưu</button>
      </form>
    </div>
  );
}
