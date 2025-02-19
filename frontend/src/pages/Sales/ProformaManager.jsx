import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Form, message, Popconfirm, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProformaForm from "./ProformaForm";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ProformaManager = () => {
  const [proformas, setProformas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProforma, setEditingProforma] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProformas, setFilteredProformas] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch proformas from the API
  const fetchProformas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/proformas/`);
      setProformas(response.data);
      setFilteredProformas(response.data); // Set filtered list initially
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
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = proformas.filter(
      (p) =>
        (p.project_name?.toLowerCase() || "").includes(lowerCaseQuery) || // Search by Project Name
        (p.client_name?.toLowerCase() || "").includes(lowerCaseQuery)    // Search by Client Name
    );
    setFilteredProformas(filtered);
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

      let response;
      if (editingProforma) {
        response = await axios.put(
          `${API_BASE_URL}/api/proformas/${editingProforma.proforma_id}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/api/proformas/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }


      message.success("Proforma saved successfully!");
       
      // ✅ Refresh proformas list from backend to reflect changes
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
    { title: "Project Name", dataIndex: "project_name", key: "project_name" },
    { title: "Client", dataIndex: "client_name", key: "client_name" },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount) => `$${Number(amount || 0).toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusColors = {
          Pending: "orange",
          Accepted: "green",
          Rejected: "red",
        };
        return (
          <span style={{ color: statusColors[status] || "blue", fontWeight: "bold" }}>
            {status}
          </span>
        );
      },
    },
    {
      title: "Technical Details (PDF)",
      dataIndex: "technical_details_pdf",
      key: "technical_details_pdf",
      render: (pdf) =>
        pdf ? (
          <a href={`${API_BASE_URL}${pdf}`} target="_blank" rel="noopener noreferrer">
            View PDF
          </a>
        ) : (
          "No File"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => navigate(`/sales/proformadetails/${record.proforma_id}`)}>
            Details
          </Button>
          <Button
            type="link"
            onClick={() => {
              setEditingProforma(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDeleteProforma(record.proforma_id)}
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
      <h1>Proforma Manager</h1>
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
            setEditingProforma(null);
            setIsModalVisible(true);
                
            // ✅ Ensure the form resets properly on the next tick
            setTimeout(() => {
              form.resetFields();
            }, 100);
          }}
        >
          Add Proforma
        </Button>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredProformas}
          rowKey="proforma_id"
          pagination={{ pageSize: 8 }}
          bordered
        />
      )}

      <Modal
        title={editingProforma ? "Edit Proforma" : "Add Proforma"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <ProformaForm form={form} initialValues={editingProforma} onSubmit={handleSaveProforma} />
      </Modal>
    </div>
  );
};

export default ProformaManager;
