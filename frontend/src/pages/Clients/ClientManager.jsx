import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Form, message, Popconfirm, Spin, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClientForm from "./ClientForm"; // Import ClientForm component

const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ClientManager = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [activeProjectsFilter, setActiveProjectsFilter] = useState(null);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch clients from API
  const fetchClients = async () => {
    setLoading(true);
    try {
      // Fetch clients and projects in parallel
      const [clientsResponse, projectsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/clients/`),
        axios.get(`${API_BASE_URL}/api/projects/`),
      ]);

      const clientsData = clientsResponse.data;
      const projectsData = projectsResponse.data;

      // Map clients and check if they have active projects
      const clientsWithProjects = clientsData.map((client) => {
        // Filter projects that belong to this client
        const clientProjects = projectsData.filter(
          (project) => project.client_name === client.client_name
        );

        // Check if at least one project is active (not "Completed")
        const hasActiveProjects = clientProjects.some(
          (project) => project.status_name !== "Completed"
        );

        return { ...client, hasActiveProjects };
      });

      setClients(clientsWithProjects);
    } catch (error) {
      message.error("Failed to fetch clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Apply filters
  const filteredClients = clients.filter((client) => {
    const matchesSearchQuery =
      client.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.client_abbreviation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = cityFilter ? client.city === cityFilter : true;

    const matchesActiveProjects =
      activeProjectsFilter === null || client.hasActiveProjects === activeProjectsFilter;

    return matchesSearchQuery && matchesCity && matchesActiveProjects;
  });

  // Handle save client
  const handleSaveClient = async (values) => {
    setFormLoading(true);
    try {
      if (editingClient) {
        const response = await axios.put(
          `${API_BASE_URL}/api/clients/${editingClient.client_id}/`,
          values
        );
        setClients((prev) =>
          prev.map((c) => (c.client_id === editingClient.client_id ? response.data : c))
        );
        message.success("Client updated successfully!");
      } else {
        const response = await axios.post(`${API_BASE_URL}/api/clients/`, values);
        setClients((prev) => [...prev, response.data]);
        message.success("Client added successfully!");
      }
      setIsModalVisible(false);
      setEditingClient(null);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save client.");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete client
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
    {
      title: "Client Name",
      dataIndex: "client_name",
      key: "client_name",
    },
    {
      title: "Abbreviation",
      dataIndex: "client_abbreviation",
      key: "client_abbreviation",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Projects",
      dataIndex: "project_count",
      key: "project_count",
      render: (count) => count || 0,
    },
    {
      title: "Active Projects",
      dataIndex: "hasActiveProjects",
      key: "hasActiveProjects",
      render: (active) => (active ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => navigate(`/clients/${record.client_id}`)}>
            Details
          </Button>
          <Button
            type="link"
            onClick={() => {
              setEditingClient(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDeleteClient(record.client_id)} okText="Yes" cancelText="No">
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
      <h1>Client Manager</h1>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <Input.Search
          placeholder="Search clients..."
          allowClear
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "300px" }}
        />
        <div style={{ display: "flex", gap: "8px" }}>
          {/* Filter by City */}
          <Select
            placeholder="Filter by City"
            allowClear
            onChange={(value) => setCityFilter(value)}
            style={{ width: "150px" }}
          >
            {[...new Set(clients.map((c) => c.city))].map((city) => (
              <Option key={city} value={city}>
                {city}
              </Option>
            ))}
          </Select>

          {/* Filter by Active Projects */}
          <Select
            placeholder="Filter by Active Projects"
            allowClear
            onChange={(value) => setActiveProjectsFilter(value ?? null)}
            style={{ width: "200px" }}
          >
            <Option value={true}>Active</Option>
            <Option value={false}>Completed</Option>
          </Select>
        </div>
        <Button
          type="primary"
          onClick={() => {
            setEditingClient(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add Client
        </Button>
      </div>

      {loading ? <Spin /> : <Table columns={columns} dataSource={filteredClients} rowKey="client_id" pagination={{ pageSize: 8 }} bordered />}

      <Modal title={editingClient ? "Edit Client" : "Add Client"} visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <ClientForm form={form} initialValues={editingClient} onSubmit={handleSaveClient} />
      </Modal>
    </div>
  );
};

export default ClientManager;
