import React from "react";
import { Layout } from "antd";

const { Header } = Layout;

const AntNavbar = ({ onLogout }) => {
  return (
    <Header className="ant-navbar">
      {/* Logo Section */}
      <div className="logo">
        <img
          src="/img1 logo.jpg" // Replace with the correct logo path
          alt="ElevatorSys Logo"
        />
        <span>ElevatorSys</span>
      </div>

      {/* Action Section */}
      <div className="actions">
        <span className="action">🔔 Notifications</span>
        {/* Logout as a text link */}
        <span className="action" onClick={onLogout}>
          Logout
        </span>
      </div>
    </Header>
  );
};

export default AntNavbar;
