import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  message,
  Modal,
  Popconfirm,
  Spin,
  Card,
  Row,
  Col,
  Typography,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProjectAssignmentForm from "./ProjectAssignmentForm";
import EditAssignmentForm from "./EditAssignmentForm";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ProjectAssignmentsManager = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/project-assignments/`
      );
      const list = response.data || [];
      setAssignments(list);
      setFilteredAssignments(list);
    } catch (error) {
      message.error("Failed to fetch project assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredAssignments(assignments);
      return;
    }

    setFilteredAssignments(
      assignments.filter((a) => {
        const project = String(a.project || "").toLowerCase();
        const area = String(a.area_name || "").toLowerCase();
        const person = String(a.personnel_name || "").toLowerCase();
        return (
          project.includes(q) || area.includes(q) || person.includes(q)
        );
      })
    );
  }, [assignments, searchQuery]);

  const handleSaveAssignment = async (values) => {
    try {
      if (editingAssignment) {
        await axios.put(
          `${API_BASE_URL}/api/project-assignments/${editingAssignment.id}/`,
          values
        );
        message.success("Project assignment updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/project-assignments/`, values);
        message.success("Project assignment added successfully!");
      }

      setIsModalVisible(false);
      setEditingAssignment(null);
      await fetchAssignments();
    } catch (error) {
      message.error("Failed to save project assignment.");
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/project-assignments/${id}/`);
      message.success("Project assignment deleted successfully!");
      await fetchAssignments();
    } catch (error) {
      message.error("Failed to delete project assignment.");
    }
  };

  const columns = [
    { title: "Project", dataIndex: "project", key: "project" },
    { title: "Area", dataIndex: "area_name", key: "area_name" },
    { title: "Personnel", dataIndex: "personnel_name", key: "personnel_name" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/project-assignments/details/${record.id}`)}
          >
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
            title="Delete this assignment?"
            onConfirm={() => handleDeleteAssignment(record.id)}
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
            Project Assignments
          </Typography.Title>
          <Typography.Text type="secondary">
            Assign personnel to projects by area
          </Typography.Text>
        </Col>

        <Col>
          <Space>
            <Input.Search
              placeholder="Search by Project, Area, or Personnel"
              allowClear
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 320 }}
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
          </Space>
        </Col>
      </Row>

      {/* Table */}
      <Card className="table-card">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
            <Spin />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredAssignments}
            rowKey="id"
            pagination={{ pageSize: 8, showSizeChanger: true }}
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        title={editingAssignment ? "Edit Assignment" : "Add Assignment"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingAssignment(null);
        }}
        footer={null}
        centered
        destroyOnClose
      >
        {editingAssignment ? (
          <EditAssignmentForm
            initialValues={editingAssignment}
            onSubmit={handleSaveAssignment}
          />
        ) : (
          <ProjectAssignmentForm onSubmit={handleSaveAssignment} />
        )}
      </Modal>
    </div>
  );
};

export default ProjectAssignmentsManager;
