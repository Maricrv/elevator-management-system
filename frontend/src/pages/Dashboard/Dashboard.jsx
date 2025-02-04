import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Table, message, Spin } from "antd";
import { Pie, Bar } from "@ant-design/plots";
import axios from "axios";
import {
  DollarCircleOutlined,
  ProjectOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalClients: 0,
    totalProjects: 0,
    totalSales: 0,
    totalProformas: 0,
    totalPersonnel: 0,
    totalAssignments: 0,
    projectStatus: [],
    recentSales: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ Fetch API Data
  const fetchDashboardData = async () => {
    try {
      console.log("Fetching dashboard data...");

      const [clients, projects, sales, personnel, proformas, assignments] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/clients/`),
        axios.get(`${API_BASE_URL}/api/projects/`),
        axios.get(`${API_BASE_URL}/api/sales/`),
        axios.get(`${API_BASE_URL}/api/personnel/`),
        axios.get(`${API_BASE_URL}/api/proformas/`),
        axios.get(`${API_BASE_URL}/api/project-assignments/`),
      ]);

      console.log("✅ Clients Data:", clients.data);
      console.log("✅ Projects Data:", projects.data);
      console.log("✅ Sales Data:", sales.data);
      console.log("✅ Personnel Data:", personnel.data);
      console.log("✅ Proformas Data:", proformas.data);
      console.log("✅ Assignments Data:", assignments.data);

      // ✅ Handle Pagination in Sales API
      const totalSales = sales.data.count ?? sales.data.results?.length ?? 0;
      const recentSales = sales.data.results ? sales.data.results.slice(0, 5) : [];

      // ✅ Count project statuses
      const statusCount = projects.data.reduce((acc, project) => {
        const status = project.status_name || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // ✅ Format project status for Pie Chart
      const projectStatusData = Object.keys(statusCount).map((status) => ({
        type: status,
        value: statusCount[status],
      }));

      setSummary({
        totalClients: clients.data.length || 0,
        totalProjects: projects.data.length || 0,
        totalSales,
        totalProformas: proformas.data.length || 0,
        totalPersonnel: personnel.data.length || 0,
        totalAssignments: assignments.data.length || 0,
        projectStatus: projectStatusData,
        recentSales,
      });

    } catch (error) {
      console.error("❌ Dashboard API Error:", error.response?.data || error.message);
      message.error("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Recent Sales Table Columns
  const salesColumns = [
    { title: "Proforma #", dataIndex: "proforma", key: "proforma", render: (proforma) => proforma ?? "N/A" },
    { title: "Client", dataIndex: "client_name", key: "client_name", render: (name) => name ?? "N/A" },
    { title: "Model", dataIndex: "model_name", key: "model_name", render: (model) => model ?? "N/A" },
    { title: "Price", dataIndex: "price", key: "price", render: (price) => price ? `$${parseFloat(price).toFixed(2)}` : "N/A" },
    { title: "Status", dataIndex: "paid", key: "paid", render: (paid) => (paid ? "Paid" : "Unpaid") },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <h1>Dashboard</h1>

      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          {/* ✅ Summary Cards */}
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic title="Total Clients" value={summary.totalClients} prefix={<UserOutlined />} />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic title="Total Projects" value={summary.totalProjects} prefix={<ProjectOutlined />} />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic title="Total Sales" value={summary.totalSales} prefix={<DollarCircleOutlined />} />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic title="Total Personnel" value={summary.totalPersonnel} prefix={<TeamOutlined />} />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic title="Total Proformas" value={summary.totalProformas} prefix={<FileTextOutlined />} />
              </Card>
            </Col>
          </Row>

          {/* ✅ Charts and Recent Sales */}
          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            <Col xs={24} md={12}>
              <Card title="Project Status Breakdown">
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
              <Card title="Recent Sales">
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
        </>
      )}
    </div>
  );
};

export default Dashboard;
