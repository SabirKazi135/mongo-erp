import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Boxes,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [company, setCompany] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const savedCompany = JSON.parse(
      localStorage.getItem("selectedCompany") ||
        localStorage.getItem("company") ||
        "null",
    );

    if (savedCompany) {
      setCompany(savedCompany);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("company");
    localStorage.removeItem("selectedCompany");
    navigate("/");
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/app/dashboard",
    },
    {
      name: "Edit Company",
      icon: Building2,
      path: "/app/edit-company",
    },
    {
      name: "Invoice",
      icon: FileText,
      path: "/app/invoice",
    },
    {
      name: "Item Master",
      icon: Boxes,
      path: "/app/item-master",
    },
    {
      name: "Reports",
      icon: BarChart3,
      path: "/app/reports",
    },
  ];

  const currentPage =
    menuItems.find((item) => location.pathname.startsWith(item.path))?.name ||
    "Dashboard";

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-[260px]" : "w-[90px]"
        } bg-white border-r border-[#E5E7EB] transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-[78px] border-b border-[#E5E7EB] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-[42px] w-[42px] rounded-md bg-[#1349EC] text-white flex items-center justify-center font-bold">
              M
            </div>

            {sidebarOpen && (
              <span className="text-[22px] font-bold text-[#363636]">ERP</span>
            )}
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#6B7280]"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 py-5 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `h-[48px] rounded-lg flex items-center gap-3 px-4 transition font-medium
                  ${
                    isActive
                      ? "bg-[#1349EC] text-white"
                      : "text-[#4B5563] hover:bg-[#EEF2FF]"
                  }`
                }
              >
                <Icon size={18} />

                {sidebarOpen && (
                  <span className="text-[15px]">{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-[#E5E7EB]">
          <button
            onClick={handleLogout}
            className="w-full h-[48px] rounded-lg bg-red-500 text-white flex items-center justify-center gap-2 hover:bg-red-600 transition"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Right Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-[78px] bg-white border-b border-[#E5E7EB] px-8 flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#363636]">
              {currentPage}
            </h1>

            <p className="text-[14px] text-[#6B7280] mt-1">
              Welcome back, {company?.companyName || "Your Company"}
            </p>
          </div>

          <div className="h-[42px] w-[42px] rounded-full bg-[#1349EC] text-white flex items-center justify-center font-semibold">
            {company?.companyName?.charAt(0) || "C"}
          </div>
        </header>

        {/* Main */}
        <main className="p-8 flex-1 overflow-y-auto">
          <Outlet context={{ company }} />
        </main>
      </div>
    </div>
  );
}
