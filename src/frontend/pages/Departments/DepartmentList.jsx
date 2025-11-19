import { useState } from "react";
import "../../styles/DepartmentList.css";

const seed = [
  { id: 1, code: "PDT", name: "Phòng Đào tạo", status: "active", year: 2019 },
  { id: 2, code: "PCT", name: "Phòng Công tác", status: "active", year: 2020 },
];

export default function DepartmentList() {
  const [rows, setRows] = useState(seed);
  const [form, setForm] = useState({
    id: null,
    code: "",
    name: "",
    year: 2025,
  });
  const [open, setOpen] = useState(false);

  const openAdd = () => {
    setForm({ id: null, code: "", name: "", year: 2025 });
    setOpen(true);
  };

  const openEdit = (row) => {
    setForm(row);
    setOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    setRows((prev) => {
      if (form.id) {
        const i = prev.findIndex((x) => x.id === form.id);
        const arr = [...prev];
        arr[i] = form;
        return arr;
      }
      const nextId = Math.max(...prev.map((x) => x.id)) + 1;
      return [...prev, { ...form, id: nextId, status: "active" }];
    });
    setOpen(false);
    setForm({ id: null, code: "", name: "", year: 2025 });
  };

  return (
    <div className="page-container">
      <div className="list-header-row">
        <h2 className="title" style={{ marginBottom: 0 }}>
          Phòng ban
        </h2>
        <button className="btn-add" onClick={openAdd}>
          + Thêm
        </button>
      </div>

      <table className="dept-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã</th>
            <th>Tên</th>
            <th>Trạng thái</th>
            <th>Năm</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.code}</td>
              <td>{r.name}</td>
              <td>
                <span className={`status-badge ${r.status}`}>{r.status}</span>
              </td>
              <td>{r.year}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button
                  className="btn-small btn-edit"
                  onClick={() => openEdit(r)}
                >
                  Sửa
                </button>
                <button
                  className="btn-small btn-delete"
                  onClick={() =>
                    setRows((prev) => prev.filter((x) => x.id !== r.id))
                  }
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <div className="dept-modal-backdrop">
          <div className="dept-modal">
            <div className="dept-modal-header">
              <h3 style={{ margin: 0 }}>
                {form.id ? "Sửa phòng ban" : "Thêm phòng ban"}
              </h3>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <form onSubmit={save} className="dept-modal-form">
              <div>
                <label>Mã</label>
                <input
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value.toUpperCase() })
                  }
                  required
                />
              </div>
              <div>
                <label>Tên</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Năm</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) =>
                    setForm({ ...form, year: +e.target.value })
                  }
                  required
                />
              </div>

              <div className="dept-modal-actions">
                <button type="submit" className="btn-add">
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{ background: "#e5e7eb" }}
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

