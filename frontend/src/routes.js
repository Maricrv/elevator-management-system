import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import ClientManager from "./pages/Clients/ClientManager";
import Proformas from "./pages/Proformas/Proformas";
import Sales from "./pages/Sales/Sales";
import SaleDetails from "./pages/Sales/SaleDetails";
import Projects from "./pages/Projects/Projects";
import Inventory from "./pages/Inventory/Inventory";
import InventoryTransactions from "./pages/Inventory/InventoryTransactions";
import MaintenanceRequests from "./pages/Maintenance/MaintenanceRequests";
import MaintenanceLogs from "./pages/Maintenance/MaintenanceLogs";
import Configurations from "./pages/Configurations/Configurations";
import Reports from "./pages/Reports/Reports";
import Personnel from "./pages/Personnel/Personnel";
import NotFound from "./pages/NotFound/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/clients" element={<ClientManager />} />
      <Route path="/proformas" element={<Proformas />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/sales/:id" element={<SaleDetails />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/inventory/transactions" element={<InventoryTransactions />} />
      <Route path="/maintenance/requests" element={<MaintenanceRequests />} />
      <Route path="/maintenance/logs" element={<MaintenanceLogs />} />
      <Route path="/configurations" element={<Configurations />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/personnel" element={<Personnel />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
