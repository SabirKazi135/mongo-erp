import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import SelectCompany from "../pages/SelectCompany";
import AddCompany from "../pages/AddCompany";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import EditCompany from "../pages/EditCompany";
import Invoice from "../pages/Invoice";
import ItemMaster from "../pages/ItemMaster";
import Reports from "../pages/Reports";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/select-company" element={<SelectCompany />} />
        <Route path="/add-company" element={<AddCompany />} />

        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="edit-company" element={<EditCompany />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="item-master" element={<ItemMaster />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
