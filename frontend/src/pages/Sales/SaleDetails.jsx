import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { Descriptions, Spin, Button, message, Modal, Popconfirm } from "antd";
import axios from "axios";
import SaleForm from "./SaleForm";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const SaleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // ✅ Load Sale Details
  const loadSaleDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sales/${id}/`);
      const data = response.data; // Corregido el acceso a los datos
      setSale({
        ...data,
        payment_date: data.payment_date ? dayjs(data.payment_date) : null,
      });
    } catch (error) {
      message.error("Failed to fetch sale details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Save Sale
  const handleSave = async (values) => {
    try {
      await axios.put(`${API_BASE_URL}/api/sales/${id}/`, values);
      message.success("Sale updated successfully!");
      loadSaleDetails(); // Refrescar los datos después de la edición
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update sale.");
    }
  };

  // ✅ Handle Delete Sale
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/sales/${id}/`);
      message.success("Sale deleted successfully!");
      navigate("/sales"); // Redirigir después de eliminar
    } catch (error) {
      message.error("Failed to delete sale.");
    }
  };

  useEffect(() => {
    loadSaleDetails();
  }, []);

  if (loading) {
    return <Spin />;
  }

  if (!sale) {
    return <p>Sale not found.</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1>Sale Details</h1>

      <Descriptions bordered column={2}>
        <Descriptions.Item label="Sale ID">{sale.sale_id ?? "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Proforma ID">{sale.proforma ?? "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Project Name">{sale.project_name ?? "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Proforma Date">{sale.proforma_date ?? "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Client">{sale.client_name ?? "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Model">{sale.model_name ?? "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Price">{sale.price ? `$${sale.price}` : "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Payment Status">
          <span style={{ fontWeight: "bold", color: sale.paid ? "green" : "red" }}>
            {sale.paid ? "Paid" : "Unpaid"}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Payment Date">
          {sale.payment_date ? sale.payment_date.format("YYYY-MM-DD") : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Method">{sale.payment_method ?? "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Notes">{sale.notes ?? "No notes available."}</Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: "16px", textAlign: "right" }}>
        {!sale.paid && (
          <Button type="primary" onClick={() => setIsModalVisible(true)}>Edit</Button>
        )}

        <Popconfirm
          title="Are you sure you want to delete this sale?"
          onConfirm={handleDelete}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger style={{ marginLeft: "8px" }}>
            Delete
          </Button>
        </Popconfirm>

        <Button
          style={{ marginLeft: "8px" }}
          onClick={() => navigate(-1)}
        >
          Back to Sales
        </Button>
      </div>

      {/* ✅ Edit Sale in a Modal */}
      <Modal
        title="Edit Sale"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <SaleForm initialValues={sale} onSubmit={handleSave} />
      </Modal>
    </div>
  );
};

export default SaleDetails;
