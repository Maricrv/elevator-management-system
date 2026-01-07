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
import ClientForm from "./ClientForm";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ClientManager = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clients/`);
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      message.error("Failed to fetch clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredClients(
      clients.filter(
        (c) =>
          String(c.client_name || "").toLowerCase().includes(q) ||
          String(c.client_abbreviation || "").toLowerCase().includes(q)
      )
    );
  }, [clients, searchQuery]);

  const handleSaveClient = async (values) => {
    try {
      if (editingClient) {
        await axios.put(
          `${API_BASE_URL}/api/clients/${editingClient.client_id}/`,
          values
        );
      } else {
        await axios.post(`${API_BASE_URL}/api/clients/`, values);
      }

      message.success("Client saved successfully!");
      setIsModalVisible(false);
      setEditingClient(null);
      form.resetFields();
      fetchClients();
    } catch (error) {
      message.error("Failed to save client.");
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/clients/${clientId}/`);
      setClients((prev) => prev.filter((c) => c.client_id !== clientId));
      message.success("Client deleted successfully!");
    } catch (error) {
      message.error("Failed to delete client.");
    }
  };

  const columns = [
    { title: "Client Name", dataIndex: "client_name", key: "client_name" },
    {
      title: "Abbreviation",
      dataIndex: "client_abbreviation",
      key: "client_abbreviation",
    },
    { title: "Contact", dataIndex: "client_contact", key: "client_contact" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/clients/${record.client_id}`)}
          >
            Details
          </Button>
          <Button
            type="link"
            onClick={() => {
              setEditingClient(record);
              setIsModalVisible(true);
              setTimeout(() => form.resetFields(), 0);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this client?"
            onConfirm={() => handleDeleteClient(record.client_id)}
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
            Client Manager
          </Typography.Title>
          <Typography.Text type="secondary">
            Manage clients and company information
          </Typography.Text>
        </Col>

        <Col>
          <Space>
            <Input.Search
              placeholder="Search by Client Name or Abbreviation"
              allowClear
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              size="middle"
              onClick={() => {
                setEditingClient(null);
                setIsModalVisible(true);
                setTimeout(() => form.resetFields(), 0);
              }}
            >
              Add Client
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
            dataSource={filteredClients}
            rowKey="client_id"
            pagination={{ pageSize: 8, showSizeChanger: true }}
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        title={editingClient ? "Edit Client" : "Add Client"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingClient(null);
        }}
        footer={null}
      >
        <ClientForm
          form={form}
          initialValues={editingClient}
          onSubmit={handleSaveClient}
        />
      </Modal>
    </div>
  );
};

export default ClientManager;
