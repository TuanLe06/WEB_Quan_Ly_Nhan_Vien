export default function App() {
  const [activeTab, setActiveTab] = useState('employees');
  const [depts, setDepts] = useState(initialDepartments);
  const [positions, setPositions] = useState(initialPositions);
  const [emps, setEmps] = useState(initialEmployees);

  const renderContent = () => {
    switch (activeTab) {
      case 'departments': return <DepartmentManager depts={depts} setDepts={setDepts} />;
      case 'positions': return <div className="p-6">Chức năng quản lý chức vụ</div>;
      case 'employees': return <EmployeeManager emps={emps} setEmps={setEmps} depts={depts} positions={positions} />;
      case 'payroll': return <PayrollSystem emps={emps} />;
      default: return <div className="p-6">Trang chủ Dashboard</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto h-screen">
        <header className="bg-white border-b p-4 shadow-sm">
          <h2 className="font-bold text-lg text-gray-700 capitalize">{activeTab}</h2>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}