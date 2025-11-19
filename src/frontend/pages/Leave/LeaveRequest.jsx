import React, { useEffect, useState } from "react";
import "../../styles/LeaveRequest.css";

const EMP_STORAGE_KEY = "ems_employees";
const LEAVE_STORAGE_KEY = "ems_leave_requests";

function getEmployees() {
  try {
    const raw = localStorage.getItem(EMP_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Cannot read employees from storage", e);
    return [];
  }
}

function getLeaves() {
  try {
    const raw = localStorage.getItem(LEAVE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Cannot read leaves from storage", e);
    return [];
  }
}

function saveLeaves(leaves) {
  localStorage.setItem(LEAVE_STORAGE_KEY, JSON.stringify(leaves));
}

function getEmpDisplay(emp) {
  return {
    code: emp.code || emp.maNV || emp.id || "",
    name: emp.name || emp.hoTen || emp.fullName || "",
  };
}

export default function LeaveRequest() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employeeCode: "",
    type: "Nghỉ phép",
    startDate: "",
    endDate: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.employeeCode || !form.startDate || !form.endDate) {
      setMessage("Vui lòng chọn nhân viên và nhập đủ ngày bắt đầu / kết thúc.");
      return;
    }

    const allEmployees = getEmployees();
    const emp = allEmployees.find(
      (x) =>
        getEmpDisplay(x).code.toString() === form.employeeCode.toString()
    );

    const { code, name } = emp ? getEmpDisplay(emp) : { code: "", name: "" };

    const newLeave = {
      id: Date.now(),
      employeeCode: code,
      employeeName: name || "Không rõ",
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      status: "Chờ duyệt",
    };

    const leaves = getLeaves();
    leaves.push(newLeave);
    saveLeaves(leaves);

    setMessage("Gửi yêu cầu nghỉ thành công. Vui lòng chờ duyệt.");
    setForm({
      employeeCode: "",
      type: "Nghỉ phép",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="page-container">
      <h2 className="title">Gửi yêu cầu nghỉ</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Nhân viên</label>
          <select
            name="employeeCode"
            value={form.employeeCode}
            onChange={handleChange}
          >
            <option value="">-- Chọn nhân viên --</option>
            {employees.map((emp) => {
              const { code, name } = getEmpDisplay(emp);
              return (
                <option key={code} value={code}>
                  {name} ({code})
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-row">
          <label>Loại nghỉ</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="Nghỉ phép">Nghỉ phép</option>
            <option value="Nghỉ ốm">Nghỉ ốm</option>
            <option value="Nghỉ không lương">Nghỉ không lương</option>
          </select>
        </div>

        <div className="form-row">
          <label>Ngày bắt đầu</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Ngày kết thúc</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="primary-btn">
          Gửi yêu cầu
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
}
