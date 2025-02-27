import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Form, message, Popconfirm, Spin, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClientForm from "./ClientForm";

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ClientManager = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
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
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = clients.filter(
      (c) =>
        (c.client_name?.toLowerCase() || "").includes(lowerCaseQuery) ||
        (c.client_abbreviation?.toLowerCase() || "").includes(lowerCaseQuery)
    );
    setFilteredClients(filtered);
  }, [clients, searchQuery]);

  const handleSaveClient = async (values) => {
    try {
      let response;
      if (editingClient) {
        response = await axios.put(
          `${API_BASE_URL}/api/clients/${editingClient.client_id}/`,
          values
        );
      } else {
        response = await axios.post(`${API_BASE_URL}/api/clients/`, values);
      }

      message.success("Client saved successfully!");
      await fetchClients();
      setIsModalVisible(false);
      setEditingClient(null);
      form.resetFields();
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
    { title: "Abbreviation", dataIndex: "client_abbreviation", key: "client_abbreviation" },
    { title: "Contact", dataIndex: "client_contact", key: "client_contact" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => navigate(`/clients/${record.client_id}`)}>Details</Button>
          <Button
            type="link"
            onClick={() => {
              setEditingClient(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDeleteClient(record.client_id)} okText="Yes" cancelText="No">
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="page-container" style={{ padding: "16px" }}>
      <h1>Client Manager</h1>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <Input.Search
          placeholder="Search by Client Name or Abbreviation"
          allowClear
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "300px" }}
        />
        <Button
          type="primary"
          onClick={() => {
            setEditingClient(null);
            setIsModalVisible(true);
            setTimeout(() => form.resetFields(), 100);
          }}
        >
          Add Client
        </Button>
      </div>
      {loading ? <Spin /> : <Table columns={columns} dataSource={filteredClients} rowKey="client_id" pagination={{ pageSize: 8 }} bordered />}
      <Modal
        title={editingClient ? "Edit Client" : "Add Client"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <ClientForm form={form} initialValues={editingClient} onSubmit={handleSaveClient} />
      </Modal>
    </div>
  );
};

export default ClientManager;
