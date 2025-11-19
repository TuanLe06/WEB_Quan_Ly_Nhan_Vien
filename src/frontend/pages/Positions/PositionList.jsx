import { useState } from "react";
import "../../styles/PositionList.css";

const seed = [
  { code: "T", name: "Trưởng phòng", note: "Tổ chức & quản lý" },
  { code: "P", name: "Phó phòng", note: "Hỗ trợ trưởng phòng" },
  { code: "N", name: "Nhân viên", note: "Thực hiện chuyên môn" },
];

export default function PositionList() {
  const [rows, setRows] = useState(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", note: "" });
  const [editing, setEditing] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setForm({ code: "", name: "", note: "" });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm(row);
    setOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    setRows((prev) => {
      const i = prev.findIndex((x) => x.code === form.code);
      if (i > -1) {
        const arr = [...prev];
        arr[i] = form;
        return arr;
      }
      return [...prev, form];
    });
    setOpen(false);
    setEditing(null);
    setForm({ code: "", name: "", note: "" });
  };

  return (
    <div className="page-container">
      <div className="list-header-row">
        <h2 className="title" style={{ marginBottom: 0 }}>
          Chức vụ
        </h2>
        <button className="btn-add" onClick={openAdd}>
          + Thêm
        </button>
      </div>

      <table className="pos-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên</th>
            <th>Ghi chú</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.code}>
              <td>{r.code}</td>
              <td>{r.name}</td>
              <td>{r.note}</td>
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
                    setRows((prev) => prev.filter((x) => x.code !== r.code))
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
        <div className="pos-modal-backdrop">
          <div className="pos-modal">
            <div className="pos-modal-header">
              <h3 style={{ margin: 0 }}>
                {editing ? "Sửa chức vụ" : "Thêm chức vụ"}
              </h3>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <form onSubmit={save} className="pos-modal-form">
              <div>
                <label>Mã</label>
                <input
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value.toUpperCase() })
                  }
                  disabled={!!editing}
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
                <label>Ghi chú</label>
                <input
                  value={form.note}
                  onChange={(e) =>
                    setForm({ ...form, note: e.target.value })
                  }
                />
              </div>

              <div className="pos-modal-actions">
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
