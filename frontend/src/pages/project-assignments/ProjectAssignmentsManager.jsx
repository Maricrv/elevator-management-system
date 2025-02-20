import React, { useEffect, useState } from "react";
import { Table, Button, Input, message, Modal, Popconfirm, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProjectAssignmentForm from "./ProjectAssignmentForm"; // Importing the form component

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ProjectAssignmentsManager = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  // ✅ Fetch project assignments
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/project-assignments/`);
      setAssignments(response.data);
      setFilteredAssignments(response.data); // ✅ Set filtered list initially
    } catch (error) {
      message.error("Failed to fetch project assignments.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update filteredAssignments based on searchQuery
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = assignments.filter(
      (a) =>
        (a.project?.toString() || "").includes(lowerCaseQuery) || // Search by Project ID
        (a.area_name?.toLowerCase() || "").includes(lowerCaseQuery) || // Search by Area
        (a.personnel_name?.toLowerCase() || "").includes(lowerCaseQuery) // Search by Personnel
    );
    setFilteredAssignments(filtered);
  }, [assignments, searchQuery]);

  // ✅ Save or update an assignment
  const handleSaveAssignment = async (values) => {
    try {
      if (editingAssignment) {
        await axios.put(`${API_BASE_URL}/api/project-assignments/${editingAssignment.id}/`, values);
        message.success("Project assignment updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/project-assignments/`, values);
        message.success("Project assignment added successfully!");
      }

      setIsModalVisible(false);
      setEditingAssignment(null);
      await fetchAssignments(); // ✅ Refresh list after add/update
    } catch (error) {
      message.error("Failed to save project assignment.");
    }
  };

  // ✅ Delete an assignment
  const handleDeleteAssignment = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/project-assignments/${id}/`);
      message.success("Project assignment deleted successfully!");
      await fetchAssignments(); // ✅ Refresh list after delete
    } catch (error) {
      message.error("Failed to delete project assignment.");
    }
  };

  const columns = [
    { title: "Project ID", dataIndex: "project", key: "project" },
    { title: "Area", dataIndex: "area_name", key: "area_name" },
    { title: "Personnel", dataIndex: "personnel_name", key: "personnel_name" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => navigate(`/project-assignments/details/${record.id}`)}>
            Details
          </Button>
          <Button
            type="link"
            onClick={() => {
              setEditingAssignment(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this assignment?"
            onConfirm={() => handleDeleteAssignment(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <h1>Project Assignments Manager</h1>

      {/* ✅ Search input & button aligned to the right */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <Input.Search
          placeholder="Search by Project ID, Area, or Personnel"
          allowClear
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "300px" }}
        />
        <Button
          type="primary"
          onClick={() => {
            setEditingAssignment(null);
            setIsModalVisible(true);
          }}
        >
          Add Assignment
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredAssignments}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          bordered
        />
      )}

      {/* ✅ Pop-up modal for adding/editing assignments */}
      <Modal
        title={editingAssignment ? "Edit Assignment" : "Add Assignment"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <ProjectAssignmentForm initialValues={editingAssignment} onSubmit={handleSaveAssignment} />
      </Modal>
    </div>
  );
};

export default ProjectAssignmentsManager;
