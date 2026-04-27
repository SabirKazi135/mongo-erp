import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="w-64 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-6">ERP Panel</h2>

      <div className="space-y-2">
        <NavLink to="/app/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/app/edit-company" className={linkClass}>
          Edit Company
        </NavLink>

        <NavLink to="/app/invoice" className={linkClass}>
          Invoice
        </NavLink>

        <NavLink to="/app/item-master" className={linkClass}>
          Item Master
        </NavLink>

        <NavLink to="/app/reports" className={linkClass}>
          Reports
        </NavLink>

        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
