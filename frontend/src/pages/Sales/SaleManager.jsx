import React, { useState, useEffect } from "react";
import { Table, Input, Button, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchSales, createSale, updateSale, deleteSale } from "../../services/salesService";
import SaleForm from "./SaleForm";
import dayjs from "dayjs";

const Sales = () => {
  const [sales, setSales] = useState([]); // Store sales data
  const [filteredSales, setFilteredSales] = useState([]); // Filtered data for search
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const navigate = useNavigate();

  // ✅ Load sales data from the API
  const loadSales = async () => {
    setLoading(true);
    try {
      const data = await fetchSales();
      console.log("🔍 Sales Data from API:", data); // ✅ Debugging

      if (Array.isArray(data)) {
        setSales(data);
        setFilteredSales(data);
      } else if (data.results && Array.isArray(data.results)) {
        setSales(data.results);
        setFilteredSales(data.results);
      } else {
        console.error("Unexpected API response format:", data);
        setSales([]);
        setFilteredSales([]);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      message.error("Failed to fetch sales.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save a new or updated sale
  const handleSaveSale = async (values) => {
    try {
      if (editingSale) {
        await updateSale(editingSale.sale_id, values);
        message.success("Sale updated successfully!");
      } else {
        await createSale(values);
        message.success("Sale added successfully!");
      }
      setIsModalVisible(false);
      loadSales();
    } catch (error) {
      message.error("Failed to save sale.");
    }
  };

  // ✅ Delete a sale
  const handleDeleteSale = async (id) => {
    try {
      await deleteSale(id);
      message.success("Sale deleted successfully!");
      loadSales();
    } catch (error) {
      message.error("Failed to delete sale.");
    }
  };

  // ✅ Search sales
  const handleSearch = (query) => {
    if (!query) {
      setFilteredSales(sales);
    } else {
      setFilteredSales(
        sales.filter(
          (sale) =>
            sale.project_name.toLowerCase().includes(query.toLowerCase()) || // Filter by project name
            (sale.client_name && sale.client_name.toLowerCase().includes(query.toLowerCase())) // Filter by client name
        )
      );
    }
  };

  // ✅ Table columns
  const columns = [
    { title: "Proforma", dataIndex: "proforma", key: "proforma", render: (proforma) => proforma || "N/A" },
    { title: "Project Name", dataIndex: "project_name", key: "project_name", render: (name) => name || "N/A" },
    { title: "Client", dataIndex: "client_name", key: "client_name", render: (name) => name || "N/A" },
    { title: "Model", dataIndex: "model_name", key: "model_name", render: (model) => model || "N/A" },
    { title: "Price", dataIndex: "price", key: "price", render: (price) => (price ? `$${price}` : "N/A") },
    { title: "Payment Status", dataIndex: "paid", key: "paid", render: (paid) => (paid ? "Paid" : "Unpaid") },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => navigate(`/sales/${record.sale_id}`)}>Details</Button>
          <Button
            type="link"
            onClick={() => {
              setEditingSale({ ...record, payment_date: record.payment_date ? dayjs(record.payment_date) : null });
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDeleteSale(record.sale_id)}>Delete</Button>
        </span>
      ),
    },
  ];

  useEffect(() => {
    console.log("Fetching Sales..."); // ✅ Debugging
    loadSales();
  }, []);

  return (
    <div>
      <h1>Sales</h1>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
        <Input.Search
          placeholder="Search sales by project name or client..."
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: "300px" }}
        />
        <Button type="primary" onClick={() => { setEditingSale(null); setIsModalVisible(true); }}>Add Sale</Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredSales.length > 0 ? filteredSales : []} // ✅ Use filteredSales instead of sales
        loading={loading}
        rowKey={(record) => record.sale_id || Math.random()} // ✅ Ensure unique row key
        locale={{ emptyText: "No sales found" }} // ✅ Show message if empty
        pagination={{ pageSize: 10 }}
      />
      <Modal title={editingSale ? "Edit Sale" : "Add Sale"} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <SaleForm initialValues={editingSale || {}} onSubmit={handleSaveSale} />
      </Modal>
    </div>
  );
};

export default Sales;
