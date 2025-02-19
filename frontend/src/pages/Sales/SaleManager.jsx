import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Form, message, Popconfirm, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SaleForm from "./SaleForm";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const SalesManager = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSales, setFilteredSales] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch sales from API
  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sales/`);
      setSales(response.data.results || response.data);
      setFilteredSales(response.data.results || response.data);
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
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = sales.filter(
      (s) =>
        (s.project_name?.toLowerCase() || "").includes(lowerCaseQuery) || // Search by Project Name
        (s.client_name?.toLowerCase() || "").includes(lowerCaseQuery)    // Search by Client Name
    );
    setFilteredSales(filtered);
  }, [sales, searchQuery]);

  const handleSaveSale = async (values) => {
    try {
      let response;
      if (editingSale) {
        response = await axios.put(
          `${API_BASE_URL}/api/sales/${editingSale.sale_id}/`,
          values
        );
      } else {
        response = await axios.post(`${API_BASE_URL}/api/sales/`, values);
      }

      message.success("Sale saved successfully!");
      
      // ✅ Refresh sales list from backend to reflect changes
      await fetchSales();

      setIsModalVisible(false);
      setEditingSale(null);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save sale.");
    }
  };

  const handleDeleteSale = async (saleId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/sales/${saleId}/`);
      setSales((prev) => prev.filter((s) => s.sale_id !== saleId));
      message.success("Sale deleted successfully!");
    } catch (error) {
      message.error("Failed to delete sale.");
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
      render: (amount) => `$${Number(amount || 0).toFixed(2)}`,
    },
    {
      title: "Payment Status",
      dataIndex: "paid",
      key: "paid",
      render: (paid) => (paid ? "Paid" : "Unpaid"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => navigate(`/sales/${record.sale_id}`)}>
            Details
          </Button>
          <Button
            type="link"
            onClick={() => {
              setEditingSale(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDeleteSale(record.sale_id)}
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
      <h1>Sales Manager</h1>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <Input.Search
          placeholder="Search by Project Name or Client Name"
          allowClear
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "300px" }}
        />
        <Button
          type="primary"
          onClick={() => {
            setEditingSale(null);
            setIsModalVisible(true);

            // ✅ Ensure the form resets properly on the next tick
            setTimeout(() => {
              form.resetFields();
            }, 100);
          }}
        >
          Add Sale
        </Button>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredSales}
          rowKey="sale_id"
          pagination={{ pageSize: 8 }}
          bordered
        />
      )}

      <Modal
        title={editingSale ? "Edit Sale" : "Add Sale"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <SaleForm form={form} initialValues={editingSale} onSubmit={handleSaveSale} />
      </Modal>
    </div>
  );
};

export default SalesManager;
