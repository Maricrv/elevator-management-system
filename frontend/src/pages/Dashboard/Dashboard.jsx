import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Table, message, Spin } from "antd";
import { Pie } from "@ant-design/plots";
import axios from "axios";
import { Link } from "react-router-dom";
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
    totalProformas: 0,
    totalPersonnel: 0,
    totalAssignments: 0,
    projectStatus: [],
    recentSales: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    
    try {
      const [clients, projects, sales, personnel, proformas, assignments] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/clients/`),
        axios.get(`${API_BASE_URL}/api/projects/`),
        axios.get(`${API_BASE_URL}/api/sales/`),
        axios.get(`${API_BASE_URL}/api/personnel/`),
        axios.get(`${API_BASE_URL}/api/proformas/`),
        axios.get(`${API_BASE_URL}/api/project-assignments/`),
      ]);

      const projectStatusData = projects.data.reduce((acc, project) => {
        const status = project.status_name || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      
      const totalProjects = projects.data.length;
      const formattedProjectStatusData = Object.keys(projectStatusData).map((status) => ({
        type: status,
        value: totalProjects > 0 ? ((projectStatusData[status] / totalProjects) * 100) : 0,
      }));

      setSummary({
        totalClients: clients.data.length,
        totalProjects: projects.data.length,
        totalSales: sales.data.count,
        totalPersonnel: personnel.data.length,
        totalProformas: proformas.data.length,
        totalAssignments: assignments.data.length,
        projectStatus: formattedProjectStatusData,
        recentSales: sales.data.results ? sales.data.results.slice(0, 5) : [],
      });
    } catch (error) {
      message.error("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Business Dashboard</h1>
      {loading ?
                <Spin />
              
       : (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Link to="/clients"  className="link-card"> 
                <Card className="summary-card clients">
                  <Statistic title="Total Clients" value={summary.totalClients} prefix={<UserOutlined />} />
                </Card>
              </Link>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Link to="/projects" className="link-card">
                <Card className="summary-card projects">
                  <Statistic title="Total Projects" value={summary.totalProjects} prefix={<ProjectOutlined />} />
                </Card>
              </Link>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Link to="/sales" className="link-card">
                <Card className="summary-card sales" >
                  <Statistic title="Total Sales" value={summary.totalSales} prefix={<DollarCircleOutlined />} />
                </Card>
              </Link>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Link to="/personnel" className="link-card">
                <Card className="summary-card personnel">
                  <Statistic title="Total Personnel" value={summary.totalPersonnel} prefix={<TeamOutlined />} />
                </Card>
              </Link>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            <Col xs={24} md={12}>
              <Card title="Project Status Overview" className="chart-card">
                {summary.projectStatus.length > 0 ? (
                  <Pie data={summary.projectStatus} angleField="value" colorField="type" radius={0.8} height={250} legend={{ position: 'right' }}
                  label={{
                    content: (data) => `${data.value}%`, // Formats labels with %
                   }}
                  />
                ) : (
                  <p>No project status data available.</p>
                )}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Recent Sales" className="table-card">
                <Table dataSource={summary.recentSales} columns={[{ title: "Proforma #", dataIndex: "proforma", key: "proforma" }, { title: "Client", dataIndex: "client_name", key: "client_name" }, { title: "Model", dataIndex: "model_name", key: "model_name" }, { title: "Price", dataIndex: "price", key: "price", render: (price) => `$${parseFloat(price).toFixed(2)}` }, { title: "Status", dataIndex: "paid", key: "paid", render: (paid) => (paid ? "Paid" : "Unpaid") }]} pagination={false} bordered />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Dashboard;
