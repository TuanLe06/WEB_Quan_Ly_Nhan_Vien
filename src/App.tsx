import { Routes, Route, Link } from "react-router-dom";

// PAGES
import Login from "./frontend/pages/Login";
import Dashboard from "./frontend/pages/Dashboard";
import DepartmentList from "./frontend/pages/Departments/DepartmentList";
import DepartmentForm from "./frontend/pages/Departments/DepartmentForm";
import EmployeeList from "./frontend/pages/Employees/EmployeeList";
import EmployeeDetail from "./frontend/pages/Employees/EmployeeDetail";
import EmployeeForm from "./frontend/pages/Employees/EmployeeForm";
import PositionList from "./frontend/pages/Positions/PositionList";

// thanh nav tạm để bấm test
const Nav = () => (
  <nav style={{display:"flex", gap:12, padding:10, borderBottom:"1px solid #eee"}}>
    <Link to="/">Dashboard</Link>
    <Link to="/employees">Employees</Link>
    <Link to="/positions">Positions</Link>
    <Link to="/departments">Departments</Link>
    <Link to="/login">Login</Link>
  </nav>
);

export default function App() {
  return (
    <div>
      <Nav />
      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />

          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/new" element={<EmployeeForm />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />

          <Route path="/positions" element={<PositionList />} />

          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/departments/new" element={<DepartmentForm />} />
        </Routes>
      </div>
    </div>
  );
}
