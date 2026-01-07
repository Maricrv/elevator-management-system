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
  Tag,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProformaForm from "./ProformaForm";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const statusColor = (s) => {
  if (!s) return "default";
  const v = String(s).toLowerCase();
  if (v.includes("pending")) return "gold";
  if (v.includes("accepted")) return "green";
  if (v.includes("rejected")) return "red";
  return "blue";
};

const ProformaManager = () => {
  const [proformas, setProformas] = useState([]);
  const [filteredProformas, setFilteredProformas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProforma, setEditingProforma] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();

  const navigate = useNavigate();

  // Fetch proformas from the API
  const fetchProformas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/proformas/`);
      setProformas(response.data);
      setFilteredProformas(response.data);
    } catch (error) {
      message.error("Failed to fetch proformas.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch proformas when the component mounts
  useEffect(() => {
    fetchProformas();
  }, []);

  // Update filteredProformas based on searchQuery
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredProformas(
      proformas.filter(
        (p) =>
          String(p.project_name || "").toLowerCase().includes(q) ||
          String(p.client_name || "").toLowerCase().includes(q)
      )
    );
  }, [proformas, searchQuery]);

  const handleSaveProforma = async (values) => {
    try {
      const formData = new FormData();
      formData.append("client", values.client);
      formData.append("project_name", values.project_name);
      formData.append("proforma_date", values.proforma_date.format("YYYY-MM-DD"));
      formData.append("valid_until", values.valid_until.format("YYYY-MM-DD"));
      formData.append("description", values.description || "");
      formData.append("total_amount", values.total_amount);
      formData.append("status", values.status);

      if (values.technical_details_pdf) {
        formData.append("technical_details_pdf", values.technical_details_pdf);
      }

      if (editingProforma) {
        await axios.put(
          `${API_BASE_URL}/api/proformas/${editingProforma.proforma_id}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(`${API_BASE_URL}/api/proformas/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      message.success("Proforma saved successfully!");
      await fetchProformas();

      setIsModalVisible(false);
      setEditingProforma(null);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save proforma.");
    }
  };

  const handleDeleteProforma = async (proformaId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/proformas/${proformaId}/`);
      setProformas((prev) => prev.filter((p) => p.proforma_id !== proformaId));
      message.success("Proforma deleted successfully!");
    } catch (error) {
      message.error("Failed to delete proforma.");
    }
  };

  const columns = [
    { title: "Proforma", dataIndex: "proforma_id", key: "proforma_id" },
    { title: "Project Name", dataIndex: "project_name", key: "project_name" },
    { title: "Client", dataIndex: "client_name", key: "client_name" },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      align: "right",
      render: (amount) => `$${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={statusColor(s)}>{s || "-"}</Tag>,
    },
    {
      title: "Technical Details (PDF)",
      dataIndex: "technical_details_pdf",
      key: "technical_details_pdf",
      render: (pdf) =>
        pdf ? (
          <a
            href={`${API_BASE_URL}${pdf}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View PDF
          </a>
        ) : (
          <span style={{ color: "#999" }}>No File</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() =>
              navigate(`/sales/proformadetails/${record.proforma_id}`)
            }
          >
            Details
          </Button>
          <Button
            type="link"
            onClick={() => {
              setEditingProforma(record);
              setIsModalVisible(true);
              setTimeout(() => form.resetFields(), 0);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this proforma?"
            onConfirm={() => handleDeleteProforma(record.proforma_id)}
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
            Proforma Manager
          </Typography.Title>
          <Typography.Text type="secondary">
            Create, update, and manage proformas
          </Typography.Text>
        </Col>

        <Col>
          <Space>
            <Input.Search
              placeholder="Search by Project or Client"
              allowClear
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              onClick={() => {
                setEditingProforma(null);
                setIsModalVisible(true);
                setTimeout(() => form.resetFields(), 0);
              }}
            >
              Add Proforma
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
            dataSource={filteredProformas}
            rowKey="proforma_id"
            pagination={{ pageSize: 8, showSizeChanger: true }}
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        title={editingProforma ? "Edit Proforma" : "Add Proforma"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingProforma(null);
        }}
        footer={null}
      >
        <ProformaForm
          form={form}
          initialValues={editingProforma}
          onSubmit={handleSaveProforma}
        />
      </Modal>
    </div>
  );
};

export default ProformaManager;
