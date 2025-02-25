import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  DesktopOutlined,
  UserOutlined,
  FileTextOutlined,
  FolderOutlined,
  GoldOutlined,
  BarChartOutlined,
  UserSwitchOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu; // Correct import for SubMenu

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
          key: "/sales/list",
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
    },
    {
      key: "/project-assignments",
      path: "/project-assignments",
      label: "Assignments",
      icon: <UserSwitchOutlined />,
    },
    {
      key: "/personnel",
      path: "/personnel",
      label: "Personnel",
      icon: <TeamOutlined />,
    },
    {
      key: "/reports",
      path: "/reports",
      label: "Reports",
      icon: <BarChartOutlined />,
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
      defaultSelectedKeys={[window.location.pathname]}
      style={{
        height: "100%",
        fontSize: "15px", // Standardized font size
        fontWeight: "500", // Slightly bold for readability
      }}
    >
      {menuItems.map((item) =>
        item.children ? (
          <SubMenu key={item.key} title={item.label} icon={item.icon}>
            {item.children.map((child) => (
              <Menu.Item key={child.key}>
                <Link to={child.path} style={{ width: "100%", display: "block" }}>
                {child.label}

                </Link>
              </Menu.Item>
            ))}
          </SubMenu>
        ) : (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path} style={{ width: "100%", display: "block" }}>
              {!collapsed ? item.label : null}
            </Link>
          </Menu.Item>
        )
      )}
    </Menu>
  );
};

export default Sidebar;
