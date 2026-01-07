import React, { useMemo, useState, useEffect } from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  DesktopOutlined,
  UserOutlined,
  FileTextOutlined,
  FolderOutlined,
  BarChartOutlined,
  UserSwitchOutlined,
  TeamOutlined,
  LogoutOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";

const Sidebar = ({ collapsed, onLogout }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const menuItems = useMemo(
    () => [
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
        icon: <DollarCircleOutlined />,
        children: [
          {
            key: "/sales/proformamanager",
            path: "/sales/proformamanager",
            label: "Proformas",
            icon: <FileTextOutlined />,
          },
          {
            key: "/sales",
            path: "/sales",
            label: "Sales",
            icon: <FileTextOutlined />,
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
        label: "Reports",
        icon: <BarChartOutlined />,
        children: [
          {
            key: "/reports/proformasreports",
            path: "/reports/proformasreports",
            label: "Proformas",
            icon: <FileTextOutlined />,
          },
          {
            key: "/reports/projectsreport",
            path: "/reports/projectsreport",
            label: "Projects",
            icon: <FileTextOutlined />,
          },
          {
            key: "/reports/salesreport",
            path: "/reports/salesreport",
            label: "Sales",
            icon: <FileTextOutlined />,
          },
        ],
      },
      {
        key: "logout",
        label: "Logout",
        icon: <LogoutOutlined />,
        action: "logout",
      },
    ],
    []
  );

  // selected key: pick the best match (exact or prefix)
  const selectedKey = useMemo(() => {
    // exact match first
    const allKeys = [];
    menuItems.forEach((i) => {
      if (i.path) allKeys.push(i.key);
      if (i.children) i.children.forEach((c) => allKeys.push(c.key));
    });

    if (allKeys.includes(pathname)) return pathname;

    // fallback: longest prefix match
    const candidates = allKeys.filter((k) => pathname.startsWith(k));
    if (!candidates.length) return "/dashboard";
    return candidates.sort((a, b) => b.length - a.length)[0];
  }, [pathname, menuItems]);

  // keep parent submenu open based on route
  const parentKey = useMemo(() => {
    if (pathname.startsWith("/sales")) return "/sales";
    if (pathname.startsWith("/reports")) return "/reports";
    return "";
  }, [pathname]);

  const [openKeys, setOpenKeys] = useState(parentKey ? [parentKey] : []);

  useEffect(() => {
    // auto-open correct group when route changes
    setOpenKeys(parentKey ? [parentKey] : []);
  }, [parentKey]);

  return (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={[selectedKey]}
      openKeys={collapsed ? [] : openKeys}
      onOpenChange={(keys) => setOpenKeys(keys)}
      style={{
        height: "100%",
        fontSize: "15px",
        fontWeight: 500,
        borderRight: "1px solid #f0f0f0",
      }}
    >
      {menuItems.map((item) =>
        item.children ? (
          <Menu.SubMenu key={item.key} title={item.label} icon={item.icon}>
            {item.children.map((child) => (
              <Menu.Item key={child.key} icon={child.icon}>
                <Link to={child.path} style={{ width: "100%", display: "block" }}>
                  {child.label}
                </Link>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={item.action === "logout" ? onLogout : undefined}
          >
            {item.action === "logout" ? (
              item.label
            ) : (
              <Link to={item.path} style={{ width: "100%", display: "block" }}>
                {item.label}
              </Link>
            )}
          </Menu.Item>
        )

      )}
    </Menu>
  );
};

export default Sidebar;
