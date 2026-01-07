import React from "react";
import { Layout, Space, Typography, Button, Tooltip } from "antd";
import { BellOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AntNavbar = ({ onLogout }) => {
  return (
    <Header className="ant-navbar">
      {/* Left: Logo + App name */}
      <Space align="center" className="navbar-left">
        <img
          src="/img1 logo.jpg"
          alt="ElevatorSys Logo"
          className="navbar-logo"
        />
        <Typography.Text strong className="navbar-title">
          ElevatorSys
        </Typography.Text>
      </Space>

      {/* Right: Actions */}
      <Space size="middle" className="navbar-actions">
        <Tooltip title="Notifications">
          <Button
            type="text"
            icon={<BellOutlined />}
            className="navbar-icon-btn"
            aria-label="Notifications"
          />
        </Tooltip>

        <Tooltip title="Logout">
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={onLogout}
            className="navbar-icon-btn"
            aria-label="Logout"
          />
        </Tooltip>
      </Space>
    </Header>
  );
};

export default AntNavbar;
