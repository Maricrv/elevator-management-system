import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  message,
  Popconfirm,
  Spin,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tag,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProjectForm from "./ProjectForm"; // ✅ Ensure this is correctly imported

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const statusColor = (s) => {
  if (!s) return "default";
  const v = String(s).toLowerCase();
  if (v.includes("complete")) return "green";
  if (v.includes("progress")) return "blue";
  if (v.includes("plan")) return "gold";
  if (v.includes("quality")) return "purple";
  if (v.includes("safety")) return "cyan";
  return "default";
};

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Fetch projects from API
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/projects/`);
      setProjects(response.data);
      setFilteredProjects(response.data);
    } catch (error) {
      message.error("Failed to fetch projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on search query
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    setFilteredProjects(
      projects.filter(
        (p) =>
          String(p.project_id || "")
            .toLowerCase()
            .includes(lowerCaseQuery) ||
          String(p.project_name || "")
            .toLowerCase()
            .includes(lowerCaseQuery) ||
          String(p.client_name || "")
            .toLowerCase()
            .includes(lowerCaseQuery)
      )
    );
  }, [projects, searchQuery]);

  // Handle edit project
  const handleEditProject = (record) => {
    setEditingProject(record);
    setIsModalVisible(true);
  };

  // Handle save (Update Only)
  const handleSaveProject = async (values) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/projects/${editingProject.project_id}/`,
        values
      );
      message.success("Project updated successfully!");
      setIsModalVisible(false);
      setEditingProject(null);
      fetchProjects(); // Refresh projects
    } catch (error) {
      message.error("Failed to update project.");
    }
  };

  // Handle delete project
  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/projects/${projectId}/`);
      setProjects((prev) => prev.filter((p) => p.project_id !== projectId));
      message.success("Project deleted successfully!");
    } catch (error) {
      message.error("Failed to delete project.");
    }
  };

  // Table Columns
  const columns = [
    { title: "Project Id", dataIndex: "project_id", key: "project_id" },
    { title: "Project Name", dataIndex: "project_name", key: "project_name" },
    { title: "Client", dataIndex: "client_name", key: "client_name" },
    { title: "Start Date", dataIndex: "start_date", key: "start_date" },
    { title: "End Date", dataIndex: "end_date", key: "end_date" },
    {
      title: "Status",
      dataIndex: "status_name",
      key: "status_name",
      render: (s) => <Tag color={statusColor(s)}>{s || "-"}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/projects/${record.project_id}`)}
          >
            Details
          </Button>
          <Button type="link" onClick={() => handleEditProject(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this project?"
            onConfirm={() => handleDeleteProject(record.project_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container" style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
        <Col>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Project Manager
          </Typography.Title>
          <Typography.Text type="secondary">
            Manage projects and view details
          </Typography.Text>
        </Col>

        <Col>
          <Input.Search
            placeholder="Search by Project or Client"
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 320 }}
          />
        </Col>
      </Row>

      {/* Table Display */}
      <Card className="table-card">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
            <Spin />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredProjects}
            rowKey="project_id"
            pagination={{ pageSize: 8, showSizeChanger: true }}
            loading={loading}
          />
        )}
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Project"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingProject(null);
        }}
        footer={null}
      >
        <ProjectForm
          initialValues={editingProject || {}}
          onSubmit={handleSaveProject}
        />
      </Modal>
    </div>
  );
};

export default ProjectManager;
