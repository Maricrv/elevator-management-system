import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Layout, Modal } from "antd";

import LoginPage from "./components/LoginPage";
import Sidebar from "./components/AntSidebar";
import Navbar from "./components/AntNavbar";
import RegisterForm from "./components/RegisterForm";

import Dashboard from "./pages/Dashboard/Dashboard";
import ClientManager from "./pages/Clients/ClientManager";
import ClientDetails from "./pages/Clients/ClientDetails";
import ProjectManager from "./pages/Projects/ProjectManager";
import ProjectDetails from "./pages/Projects/ProjectDetails";
import PersonnelManager from "./pages/Personnel/PersonnelManager";
import PersonnelDetails from "./pages/Personnel/PersonnelDetails";
import SaleManager from "./pages/Sales/SaleManager";
import SaleDetails from "./pages/Sales/SaleDetails";
import ProformaManager from "./pages/Sales/ProformaManager";
import ProformaDetails from "./pages/Sales/ProformaDetails";
import ProjectsReport from "./pages/Reports/ProjectsReport";
import ProformasReports from "./pages/Reports/ProformasReports";
import SalesReport from "./pages/Reports/SalesReport";
import ProjectAssignmentsManager from "./pages/project-assignments/ProjectAssignmentsManager";
import ProjectAssignmentDetails from "./pages/project-assignments/ProjectAssignmentDetails";

import { logout as clearAuth } from "./services/authService"; // ✅ add logout() there

import "./App.css";
import "./styles/AntSidebar.css";
import "./styles/AntNavbar.css";

const { Header, Sider, Content } = Layout;

// ✅ Optional helper: check auth token (adjust key if you use a different name)
const hasToken = () => !!localStorage.getItem("accessToken");

function AppLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // ✅ Professional: persist login on refresh if token exists
  useEffect(() => {
    setIsLoggedIn(hasToken());
  }, []);

  const handleLogin = () => {
    // LoginPage should store token already; we just update UI state
    setIsLoggedIn(true);
    navigate("/dashboard", { replace: true });
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Logout",
      content: "Are you sure you want to log out?",
      okText: "Logout",
      cancelText: "Cancel",
      onOk: () => {
        clearAuth(); // clears tokens/user from localStorage
        setIsLoggedIn(false);
        navigate("/", { replace: true });
      },
    });
  };

  // ✅ Guard: prevent access to internal routes when not logged in
  const Protected = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/" replace />;
  };

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* PRIVATE ROUTES (wrapped in layout) */}
      <Route
        path="/*"
        element={
          <Protected>
            <Layout style={{ minHeight: "100vh", background: "#f4f6f8" }}>
              <Header style={{ padding: 0 }}>
                <Navbar onLogout={handleLogout} />
              </Header>

              <Layout>
                <Sider
                  collapsible
                  collapsed={collapsed}
                  onCollapse={setCollapsed}
                  breakpoint="md"
                  width={200}
                  collapsedWidth={80}
                  className="custom-sider"
                >
                  {/* ✅ Sidebar Logout */}
                  <Sidebar collapsed={collapsed} onLogout={handleLogout} />
                </Sider>

                <Content
                  style={{
                    marginLeft: collapsed ? 80 : 200,
                    marginTop: 64,
                    padding: "16px",
                    background: "#f4f6f8",
                  }}
                >
                  <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />

                      <Route path="clients" element={<ClientManager />} />
                      <Route path="clients/:id" element={<ClientDetails />} />

                      <Route path="projects" element={<ProjectManager />} />
                      <Route path="projects/:id" element={<ProjectDetails />} />

                      <Route path="personnel" element={<PersonnelManager />} />
                      <Route path="personnel/:id" element={<PersonnelDetails />} />

                      <Route path="sales" element={<SaleManager />} />
                      <Route path="sales/:id" element={<SaleDetails />} />
                      <Route path="sales/proformamanager" element={<ProformaManager />} />
                      <Route path="sales/proformadetails/:id" element={<ProformaDetails />} />

                      <Route path="reports/projectsreport" element={<ProjectsReport />} />
                      <Route path="reports/proformasreports" element={<ProformasReports />} />
                      <Route path="reports/salesreport" element={<SalesReport />} />

                      <Route path="project-assignments" element={<ProjectAssignmentsManager />} />
                      <Route
                        path="project-assignments/details/:id"
                        element={<ProjectAssignmentDetails />}
                      />

                      {/* Default inside app */}
                      <Route path="" element={<Navigate to="dashboard" replace />} />
                      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                    </Routes>
                  </div>
                </Content>
              </Layout>
            </Layout>
          </Protected>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
