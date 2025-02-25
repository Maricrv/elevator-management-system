import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "antd";
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
import SaleManager from "./pages/Sales/SaleManager"; // Sales Page
import SaleDetails from "./pages/Sales/SaleDetails"; // Sale Details Page
import ProformaManager from "./pages/Sales/ProformaManager";
import ProformaDetails from "./pages/Sales/ProformaDetails";

// ✅ NEW IMPORTS
import ProjectAssignmentsManager from "./pages/project-assignments/ProjectAssignmentsManager";
import ProjectAssignmentDetails from "./pages/project-assignments/ProjectAssignmentDetails";


import "./App.css";
import "./styles/AntSidebar.css";
import "./styles/AntNavbar.css";

const { Sider, Content } = Layout;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      {isLoggedIn ? (
        <Layout style={{ minHeight: "100vh" }}>
          {/* Navbar */}
          <Navbar onLogout={handleLogout} />

          {/* Sidebar and Main Layout */}
          <Layout>
            {/* Sidebar */}
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
              breakpoint="md"
              width={200}
              collapsedWidth={80}
              className="custom-sider"
            >
              <Sidebar collapsed={collapsed} />
            </Sider>

            {/* Content */}
            <Content
              style={{
                marginLeft: collapsed ? 80 : 200, // Adjust based on sidebar state
                marginTop: 64, // Navbar height
                padding: "16px",
              }}
            >
              <Routes>
                {/* Main Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/clients" element={<ClientManager />} />
                <Route path="/clients/:id" element={<ClientDetails />} />
                <Route path="/projects" element={<ProjectManager />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                
                <Route path="/personnel" element={<PersonnelManager />} />
                <Route path="/personnel/:id" element={<PersonnelDetails />} />
                <Route path="/sales" element={<SaleManager />} /> {/* Sales List */}
                <Route path="/sales/:id" element={<SaleDetails />} /> {/* Sale Details */}
                <Route path="/sales/proformamanager" element={<ProformaManager />} />
                <Route path="/sales/proformadetails/:id" element={<ProformaDetails />} />

                {/* ✅ NEW ROUTES FOR PROJECT ASSIGNMENTS */}
                <Route path="/project-assignments" element={<ProjectAssignmentsManager />} />
                <Route path="/project-assignments/details/:id" element={<ProjectAssignmentDetails />} />

                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<h1>404 - Page Not Found</h1>} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
