import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Descriptions, Spin, Button, message } from "antd";
import ProformaForm from "./ProformaForm"; // Import ProformaForm
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ProformaDetails = () => {
  const { id } = useParams();
  const [proforma, setProforma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const loadProformaDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/proformas/${id}/`);
      setProforma(response.data);
    } catch (error) {
      message.error("Failed to fetch proforma details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axios.put(`${API_BASE_URL}/api/proformas/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Proforma updated successfully!");
      setEditMode(false);
      loadProformaDetails();
    } catch (error) {
      message.error("Failed to update proforma. Please try again.");
    }
  };

  useEffect(() => {
    loadProformaDetails();
  }, [id]);

  if (loading) {
    return <Spin />;
  }

  if (!proforma) {
    return <p>Proforma not found.</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1>Proforma Details</h1>
      {!editMode ? (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Project Name">{proforma.project_name}</Descriptions.Item>
          <Descriptions.Item label="Client">{proforma.client_name}</Descriptions.Item>
          <Descriptions.Item label="Total Amount">
            {proforma.total_amount ? `$${Number(proforma.total_amount).toFixed(2)}` : "$0.00"}
          </Descriptions.Item>
          <Descriptions.Item label="Status">{proforma.status}</Descriptions.Item>
          <Descriptions.Item label="Proforma Date">{proforma.proforma_date || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Valid Until">{proforma.valid_until || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Description">{proforma.description || "No description provided."}</Descriptions.Item>
          {proforma.technical_details_pdf && (
            <Descriptions.Item label="Technical Details (PDF)">
              <a
                href={`${API_BASE_URL}${proforma.technical_details_pdf}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Order Form
              </a>
            </Descriptions.Item>
          )}
        </Descriptions>
      ) : (
        <ProformaForm initialValues={proforma} onSubmit={handleSave} />
      )}

      <div style={{ marginTop: "16px", textAlign: "right" }}>
        {!editMode ? (
          <Button type="primary" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        ) : null}
        <Button style={{ marginLeft: "8px" }} onClick={() => navigate("/proformas")}>
          Back to List
        </Button>
      </div>
    </div>
  );
};

export default ProformaDetails;
