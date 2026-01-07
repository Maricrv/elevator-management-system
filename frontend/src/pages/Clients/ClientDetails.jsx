import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Descriptions, Spin, Button, message, Modal } from "antd";
import ClientForm from "./ClientForm";
import axios from "axios";
import { updateClient } from "../../services/clientService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchClient = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/clients/${id}/`);
        if (isMounted) setClient(response.data);
      } catch (error) {
        if (isMounted) message.error("Failed to fetch client details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchClient();
    return () => { isMounted = false; };
  }, [id]);

  const handleSave = async (values) => {
    try {
      const updated = await updateClient(id, values);
      message.success("Client updated successfully!");
      setClient(updated);
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update client. Please try again.");
    }
  };

  if (loading) return <Spin />;
  if (!client) return <p>Client not found.</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1>Client Details</h1>

      <Descriptions bordered column={2}>
        <Descriptions.Item label="Client Name">{client.client_name}</Descriptions.Item>
        <Descriptions.Item label="Abbreviation">{client.client_abbreviation}</Descriptions.Item>
        <Descriptions.Item label="Client Contact">{client.client_contact}</Descriptions.Item>
        <Descriptions.Item label="Email">{client.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{client.phone}</Descriptions.Item>
        <Descriptions.Item label="Address">{client.address || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="City">{client.city || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Country">{client.country || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Projects Count">{client.project_count || 0}</Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Edit
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Modal
        title="Edit Client"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <ClientForm
          initialValues={client}
          onSubmit={handleSave}
          onCancel={() => setIsModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default ClientDetails;
