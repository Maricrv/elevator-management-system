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
        {/* Optional: Add text next to the logo */}
        <span>ElevatorSys</span>
      </div>

      {/* Action Section */}
      <div className="actions">
        <span className="action">🔔 Notifications</span>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </Header>
  );
};

export default AntNavbar;
