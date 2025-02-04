import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, message, Popconfirm, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProjectForm from "./ProjectForm"; // ✅ Ensure this is correctly imported

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
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
          p.project_name.toLowerCase().includes(lowerCaseQuery) ||
          (p.client_name && p.client_name.toLowerCase().includes(lowerCaseQuery))
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
      await axios.put(`${API_BASE_URL}/api/projects/${editingProject.project_id}/`, values);
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
    { title: "Project Name", dataIndex: "project_name", key: "project_name" },
    { title: "Client", dataIndex: "client_name", key: "client_name" },
    { title: "Start Date", dataIndex: "start_date", key: "start_date" },
    { title: "End Date", dataIndex: "end_date", key: "end_date" },
    { title: "Status", dataIndex: "status_name", key: "status_name" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => navigate(`/projects/${record.project_id}`)}>
            Details
          </Button>
          <Button type="link" onClick={() => handleEditProject(record)}>
            Edit
          </Button>
          <Popconfirm title="Delete this project?" onConfirm={() => handleDeleteProject(record.project_id)} okText="Yes" cancelText="No">
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <h1>Project Manager</h1>

      {/* Search Field Only (No Add Button) */}
      <div style={{ display: "flex", justifyContent: "start", marginBottom: "16px" }}>
        <Input.Search
          placeholder="Search by Project or Client"
          allowClear
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "300px" }}
        />
      </div>

      {/* Table Display */}
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowKey="project_id"
          pagination={{ pageSize: 8 }}
          bordered
        />
      )}

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
        <ProjectForm initialValues={editingProject || {}} onSubmit={handleSaveProject} />
      </Modal>
    </div>
  );
};

export default ProjectManager;
