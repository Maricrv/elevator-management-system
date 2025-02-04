import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  DesktopOutlined,
  UserOutlined,
  FileTextOutlined, // Proformas
  FolderOutlined,
  GoldOutlined, // Sales
  BarChartOutlined, // Reports
  AppstoreOutlined, // Inventory
  ToolOutlined, // Maintenance
  SettingOutlined, // Configurations
  TeamOutlined, // Personnel
  LogoutOutlined,
} from "@ant-design/icons";

const Sidebar = ({ collapsed }) => {
  const menuItems = [
    {
      key: "/dashboard",
      path: "/dashboard",
      label: "Dashboard",
      icon: <DesktopOutlined />,
    },
    {
      key: "/clients",
      path: "/clients",
      label: "Clients",
      icon: <UserOutlined />,
    },
    {
      key: "/sales",
      label: "Sales",
      icon: <GoldOutlined />,
      children: [
        {
          key: "/sales/proformamanager",
          path: "/sales/proformamanager",
          label: "Proformas",
          icon: <FileTextOutlined />,
        },
        {
          key: "/sales-list",
          path: "/sales",
          label: "Sales List",
        },
      ],
    },
    {
      key: "/projects",
      path: "/projects",
      label: "Projects",
      icon: <FolderOutlined />,
      children: [
        {
          key: "/projects/manage",
          path: "/projects",
          label: "View Projects",
        },
        {
          key: "/projects/assignpersonnel",
          path: "/projects/assignpersonnel",
          label: "Assign Personnel", // New submenu for assigning personnel
        },
      ],
    },
    {
      key: "/inventory",
      path: "/inventory",
      label: "Inventory",
      icon: <AppstoreOutlined />,
      children: [
        {
          key: "/inventory/transactions",
          path: "/inventory/transactions",
          label: "Transactions",
        },
      ],
    },
    {
      key: "/maintenance",
      path: "/maintenance",
      label: "Maintenance",
      icon: <ToolOutlined />,
      children: [
        {
          key: "/maintenance/requests",
          path: "/maintenance/requests",
          label: "Requests",
        },
        {
          key: "/maintenance/logs",
          path: "/maintenance/logs",
          label: "Logs",
        },
      ],
    },
    {
      key: "/configurations",
      path: "/configurations",
      label: "Configurations",
      icon: <SettingOutlined />,
    },
    {
      key: "/reports",
      path: "/reports",
      label: "Reports",
      icon: <BarChartOutlined />,
    },
    {
      key: "/personnel",
      path: "/personnel",
      label: "Personnel",
      icon: <TeamOutlined />,
    },
    {
      key: "/logout",
      path: "/logout",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Menu
      theme="light"
      mode="inline"
      defaultSelectedKeys={["/dashboard"]}
      style={{ height: "100%" }}
    >
      {menuItems.map((item) =>
        item.children ? (
          <Menu.SubMenu key={item.key} title={item.label} icon={item.icon}>
            {item.children.map((child) => (
              <Menu.Item key={child.key}>
                <Link to={child.path}>{!collapsed && child.label}</Link>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{!collapsed && item.label}</Link>
          </Menu.Item>
        )
      )}
    </Menu>
  );
};

export default Sidebar;
