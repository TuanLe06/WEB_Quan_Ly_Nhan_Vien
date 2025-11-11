export default function DepartmentForm() {
  return (
    <div style={{ maxWidth:520 }}>
      <h2>Department Form</h2>
      <p>Trang form độc lập (dùng khi team gắn route <code>/departments/new</code>).</p>
      <form style={{ display:"grid", gap:10 }}>
        <label>Mã <input style={{ width:"100%", padding:8, border:"1px solid #ccc", borderRadius:8 }}/></label>
        <label>Tên <input style={{ width:"100%", padding:8, border:"1px solid #ccc", borderRadius:8 }}/></label>
        <label>Năm <input type="number" style={{ width:"100%", padding:8, border:"1px solid #ccc", borderRadius:8 }}/></label>
        <button style={{ padding:"8px 12px", borderRadius:8, background:"#111", color:"#fff" }}>Lưu</button>
      </form>
    </div>
  );
}
