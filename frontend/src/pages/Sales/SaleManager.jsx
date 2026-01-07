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
import SaleForm from "./SaleForm";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const paidTag = (paid) =>
  paid ? <Tag color="green">Paid</Tag> : <Tag color="gold">Unpaid</Tag>;

const SalesManager = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Fetch sales from API
  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sales/`);
      const list = response.data?.results || response.data || [];
      setSales(list);
      setFilteredSales(list);
    } catch (error) {
      message.error("Failed to fetch sales.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch sales when component mounts
  useEffect(() => {
    fetchSales();
  }, []);

  // Update filteredSales based on searchQuery
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredSales(
      sales.filter(
        (s) =>
          String(s.project_name || "").toLowerCase().includes(q) ||
          String(s.client_name || "").toLowerCase().includes(q)
      )
    );
  }, [sales, searchQuery]);

  // Handle sale deletion
  const handleDeleteSale = async (saleId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/sales/${saleId}/`);
      setSales((prev) => prev.filter((s) => s.sale_id !== saleId));
      message.success("Sale deleted successfully!");
    } catch (error) {
      message.error("Failed to delete sale.");
    }
  };

  const handleSaveSale = async (values) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/sales/${editingSale.sale_id}/`,
        values
      );
      message.success("Sale updated successfully!");
      await fetchSales();
      setIsModalVisible(false);
      setEditingSale(null);
    } catch (error) {
      message.error("Failed to save sale.");
    }
  };

  const columns = [
    { title: "Proforma", dataIndex: "proforma", key: "proforma" },
    { title: "Project Name", dataIndex: "project_name", key: "project_name" },
    { title: "Client", dataIndex: "client_name", key: "client_name" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (amount) =>
        `$${Number(amount || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      title: "Payment Status",
      dataIndex: "paid",
      key: "paid",
      render: (paid) => paidTag(paid),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/sales/${record.sale_id}`)}
          >
            Details
          </Button>

          <Button
            type="link"
            disabled={record.paid} // disable editing if already paid
            onClick={() => {
              setEditingSale(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this sale?"
            onConfirm={() => handleDeleteSale(record.sale_id)}
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
            Sales Manager
          </Typography.Title>
          <Typography.Text type="secondary">
            Manage sales and payment status
          </Typography.Text>
        </Col>

        <Col>
          <Input.Search
            placeholder="Search by Project or Client"
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 300 }}
          />
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
            dataSource={filteredSales}
            rowKey="sale_id"
            pagination={{ pageSize: 8, showSizeChanger: true }}
          />
        )}
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Sale"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingSale(null);
        }}
        footer={null}
      >
        <SaleForm initialValues={editingSale} onSubmit={handleSaveSale} />
      </Modal>
    </div>
  );
};

export default SalesManager;
