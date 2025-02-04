import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Table, message } from "antd";
import { Pie } from "@ant-design/plots";
import axios from "axios";
import {
  DollarCircleOutlined,
  ProjectOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalClients: 0,
    totalProjects: 0,
    totalSales: 0,
    totalPersonnel: 0,
    projectStatus: [],
    recentSales: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [clients, projects, sales, personnel] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/clients/`),
          axios.get(`${API_BASE_URL}/api/projects/`),
          axios.get(`${API_BASE_URL}/api/sales/`),
          axios.get(`${API_BASE_URL}/api/personnel/`),
        ]);

        // ✅ Ensure all fetched data is in array format to avoid crashes
        const clientData = clients.data || [];
        const projectData = projects.data || [];
        const salesData = sales.data || [];
        const personnelData = personnel.data || [];

        // ✅ Count project statuses safely
        const statusCount = projectData.reduce((acc, project) => {
          const status = project.status_name || "Unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        // ✅ Format project status data for the pie chart
        const projectStatusData = Object.keys(statusCount).map((status) => ({
          type: status,
          value: statusCount[status],
        }));

        // ✅ Get recent sales (last 5 safely)
        const recentSales = salesData.slice(0, 5);

        setSummary({
          totalClients: clientData.length,
          totalProjects: projectData.length,
          totalSales: salesData.length,
          totalPersonnel: personnelData.length,
          projectStatus: projectStatusData,
          recentSales,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        message.error("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ✅ Define columns for recent sales table with proper formatting
  const salesColumns = [
    { title: "Proforma #", dataIndex: "proforma", key: "proforma", render: (proforma) => proforma ?? "N/A" },
    { title: "Client", dataIndex: "client_name", key: "client_name", render: (name) => name ?? "N/A" },
    { title: "Model", dataIndex: "model_name", key: "model_name", render: (model) => model ?? "N/A" },
    { 
      title: "Price", 
      dataIndex: "price", 
      key: "price", 
      render: (price) => price ? `$${parseFloat(price).toFixed(2)}` : "N/A" 
    },
    { 
      title: "Status", 
      dataIndex: "paid", 
      key: "paid", 
      render: (paid) => (paid ? "Paid" : "Unpaid") 
    },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <h1>Dashboard</h1>

      {/* ✅ Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic title="Total Clients" value={summary.totalClients} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic title="Total Projects" value={summary.totalProjects} prefix={<ProjectOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic title="Total Sales" value={summary.totalSales} prefix={<DollarCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic title="Total Personnel" value={summary.totalPersonnel} prefix={<TeamOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* ✅ Project Status Chart & Recent Sales Table */}
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col xs={24} md={12}>
          <Card title="Project Status Breakdown" loading={loading}>
            <Pie
              data={summary.projectStatus}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{ type: "spider", content: "{name} ({value})" }}
              height={250}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Recent Sales" loading={loading}>
            <Table
              dataSource={summary.recentSales}
              columns={salesColumns}
              rowKey={(record) => record.sale_id || Math.random()} // ✅ Ensure unique row key
              pagination={false}
              bordered
              locale={{ emptyText: "No recent sales available" }} // ✅ Improved empty state
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
