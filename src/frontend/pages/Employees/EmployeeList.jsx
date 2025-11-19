import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/EmployeeList.css";

const STORAGE_KEY = "ems_employees";

const deptMap = {
  1: { code: "PDT", name: "Phòng Đào tạo" },
  2: { code: "PCT", name: "Phòng Công tác" },
};

const seed = [
  { id: "PDT0001", name: "Nguyễn An", deptId: 1, position: "T", baseSalary: 4000000 },
  { id: "PCT0001", name: "Trần Bình", deptId: 2, position: "N", baseSalary: 3800000 },
];

function PosBadge({ code }) {
  if (code === "T") return <span className="badge-pos T">Trưởng phòng</span>;
  if (code === "P") return <span className="badge-pos P">Phó phòng</span>;
  return <span className="badge-pos N">Nhân viên</span>;
}

// helpers
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seed;
  } catch {
    return seed;
  }
};
const save = (rows) => localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));

export default function EmployeeList() {
  const [rows, setRows] = useState(load);
  const [q, setQ] = useState("");

  // modal + form
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    deptId: 1,
    position: "N",
    baseSalary: 4000000,
  });
  const resetForm = () =>
    setForm({ id: "", name: "", deptId: 1, position: "N", baseSalary: 4000000 });

  // mỗi khi rows đổi -> lưu xuống localStorage
  useEffect(() => {
    save(rows);
  }, [rows]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.id, r.name, deptMap[r.deptId]?.code, deptMap[r.deptId]?.name].some((x) =>
        String(x).toLowerCase().includes(s)
      )
    );
  }, [rows, q]);

  const openAdd = () => {
    setEditing(null);
    resetForm();
    setOpen(true);
  };
  const openEdit = (r) => {
    setEditing(r);
    setForm(r);
    setOpen(true);
  };

  const submit = (e) => {
    e.preventDefault();
    setRows((prev) => {
      if (editing) {
        const i = prev.findIndex((x) => x.id === editing.id);
        const arr = [...prev];
        arr[i] = { ...form };
        return arr;
      }
      if (prev.some((x) => x.id === form.id)) {
        alert("Mã nhân viên đã tồn tại.");
        return prev;
      }
      return [...prev, { ...form }];
    });
    setOpen(false);
    setEditing(null);
    resetForm();
  };

  return (
    <div className="page-container">
      {/* header: tiêu đề + ô tìm kiếm + nút thêm */}
      <div className="employee-header-row">
        <h2 className="title" style={{ marginBottom: 0 }}>
          Nhân viên
        </h2>
        <div className="employee-actions">
          <input
            className="employee-search"
            placeholder="Tìm theo mã, tên, phòng ban…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn-add" onClick={openAdd}>
            + Thêm nhân viên
          </button>
        </div>
      </div>

      {/* bảng nhân viên */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Mã NV</th>
            <th>Họ tên</th>
            <th>Phòng ban</th>
            <th>Chức vụ</th>
            <th>Lương cơ bản</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id}>
              <td>
                <Link to={`/employees/${r.id}`} style={{ color: "#111" }}>
                  {r.id}
                </Link>
              </td>
              <td>{r.name}</td>
              <td>
                <b>{deptMap[r.deptId]?.code}</b>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {deptMap[r.deptId]?.name}
                </div>
              </td>
              <td>
                <PosBadge code={r.position} />
              </td>
              <td>{r.baseSalary.toLocaleString("vi-VN")} đ</td>
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

      {/* Modal thêm / sửa */}
      {open && (
        <div className="employee-modal-backdrop">
          <div className="employee-modal">
            <div className="employee-modal-header">
              <h3 style={{ margin: 0 }}>
                {editing ? "Sửa nhân viên" : "Thêm nhân viên"}
              </h3>
              <button
                onClick={() => {
                  setOpen(false);
                  setEditing(null);
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={submit} className="employee-modal-form">
              <div className="employee-modal-row">
                <div>
                  <label>Mã nhân viên</label>
                  <input
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    disabled={!!editing}
                    required
                  />
                </div>
                <div>
                  <label>Họ tên</label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="employee-modal-row">
                <div>
                  <label>Phòng ban</label>
                  <select
                    value={form.deptId}
                    onChange={(e) =>
                      setForm({ ...form, deptId: Number(e.target.value) })
                    }
                  >
                    <option value={1}>PDT - Phòng Đào tạo</option>
                    <option value={2}>PCT - Phòng Công tác</option>
                  </select>
                </div>
                <div>
                  <label>Chức vụ</label>
                  <select
                    value={form.position}
                    onChange={(e) =>
                      setForm({ ...form, position: e.target.value })
                    }
                  >
                    <option value="T">Trưởng phòng</option>
                    <option value="P">Phó phòng</option>
                    <option value="N">Nhân viên</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Lương cơ bản</label>
                <input
                  type="number"
                  value={form.baseSalary}
                  onChange={(e) =>
                    setForm({ ...form, baseSalary: Number(e.target.value) })
                  }
                  min={0}
                />
              </div>

              <div className="employee-modal-actions">
                <button type="submit" className="btn-add">
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{ background: "#e5e7eb" }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


