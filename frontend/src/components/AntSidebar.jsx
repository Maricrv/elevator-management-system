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
  AppstoreOutlined,
  ToolOutlined,
  SettingOutlined,
  TeamOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import MenuItem from "antd/es/menu/MenuItem";
import SubMenu from "antd/es/menu/SubMenu";

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
      label: "Project Assignments",
      icon: <UserSwitchOutlined />,
      children: [
        {
          key: "/project-assignments/view",
          path: "/project-assignments",
          label: "View Assignments",
        },
        {
          key: "/project-assignments/assignpersonnel",
          path: "/project-assignments/assignpersonnel",
          label: "Assign Personnel",
        },
      ],
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
      mode="inline"
      defaultSelectedKeys={[window.location.pathname]}
      style={{ height: "100%" }}
    >
      {menuItems.map((item) =>
        item.children ? (
          <SubMenu key={item.key} title={item.label} icon={item.icon}>
            {item.children.map((child) => (
              <MenuItem key={child.key}>
                <Link to={child.path}>{!collapsed && child.label}</Link>
              </MenuItem>
            ))}
          </SubMenu>
        ) : (
          <MenuItem key={item.key} icon={item.icon}>
            <Link to={item.path}>{!collapsed && item.label}</Link>
          </MenuItem>
        )
      )}
    </Menu>
  );
};

export default Sidebar;
