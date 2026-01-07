import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  message,
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
import PersonnelForm from "./PersonnelForm";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const PersonnelManager = () => {
  const [personnel, setPersonnel] = useState([]);
  const [areas, setAreas] = useState([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch personnel from the API
  const fetchPersonnel = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/personnel/`);
      const list = response.data || [];
      setPersonnel(list);
      setFilteredPersonnel(list);
    } catch (error) {
      message.error("Failed to fetch personnel data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch areas (kept for your form dropdown usage)
  const fetchAreas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/areas/`);
      setAreas(response.data || []);
    } catch (error) {
      message.error("Failed to fetch areas.");
    }
  };

  useEffect(() => {
    fetchPersonnel();
    fetchAreas();
  }, []);

  // Filter list by query
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredPersonnel(personnel);
      return;
    }
    setFilteredPersonnel(
      personnel.filter(
        (p) =>
          String(p.firstname || "").toLowerCase().includes(q) ||
          String(p.lastname || "").toLowerCase().includes(q) ||
          String(p.email || "").toLowerCase().includes(q) ||
          String(p.phone || "").toLowerCase().includes(q)
      )
    );
  }, [personnel, searchQuery]);

  const handleSavePersonnel = async (values) => {
    setFormLoading(true);
    try {
      if (editingPersonnel) {
        const response = await axios.put(
          `${API_BASE_URL}/api/personnel/${editingPersonnel.personnel_id}/`,
          values
        );
        setPersonnel((prev) =>
          prev.map((p) =>
            p.personnel_id === editingPersonnel.personnel_id ? response.data : p
          )
        );
        message.success("Personnel updated successfully!");
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/api/personnel/`,
          values
        );
        setPersonnel((prev) => [...prev, response.data]);
        message.success("Personnel added successfully!");
      }

      setIsModalVisible(false);
      setEditingPersonnel(null);
      form.resetFields();

      // optional: refresh to keep backend as source of truth
      // await fetchPersonnel();
    } catch (error) {
      message.error("Failed to save personnel.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePersonnel = async (personnelId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/personnel/${personnelId}/`);
      setPersonnel((prev) => prev.filter((p) => p.personnel_id !== personnelId));
      message.success("Personnel deleted successfully!");
    } catch (error) {
      message.error("Failed to delete personnel.");
    }
  };

  const columns = [
    { title: "First Name", dataIndex: "firstname", key: "firstname" },
    { title: "Last Name", dataIndex: "lastname", key: "lastname" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Area",
      dataIndex: "area_name",
      key: "area_name",
      render: (text) => text || <span style={{ color: "#999" }}>No Area</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/personnel/${record.personnel_id}`)}
          >
            Details
          </Button>
          <Button
            type="link"
            onClick={() => {
              setEditingPersonnel(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this personnel?"
            onConfirm={() => handleDeletePersonnel(record.personnel_id)}
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
            Personnel Manager
          </Typography.Title>
          <Typography.Text type="secondary">
            Manage personnel and assignments
          </Typography.Text>
        </Col>

        <Col>
          <Space>
            <Input.Search
              placeholder="Search personnel..."
              allowClear
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              onClick={() => {
                setEditingPersonnel(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              Add Personnel
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
            dataSource={filteredPersonnel}
            rowKey="personnel_id"
            pagination={{ pageSize: 8, showSizeChanger: true }}
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        title={editingPersonnel ? "Edit Personnel" : "Add Personnel"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingPersonnel(null);
        }}
        footer={null}
        destroyOnClose
      >
        <PersonnelForm
          form={form}
          initialValues={editingPersonnel}
          onSubmit={handleSavePersonnel}
          loading={formLoading}
          areas={areas}
        />
      </Modal>
    </div>
  );
};

export default PersonnelManager;
