import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Descriptions, Spin, Button, message } from "antd";
import ClientForm from "./ClientForm"; // Import ClientForm
import { fetchClientById, updateClient } from "../../services/clientService"; // API calls

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const loadClientDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchClientById(id);
      setClient(data);
    } catch (error) {
      message.error("Failed to fetch client details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    try {
      const updatedClient = await updateClient(id, values);
      message.success("Client updated successfully!");
      setClient(updatedClient);
      setEditMode(false);
    } catch (error) {
      message.error("Failed to update client. Please try again.");
    }
  };

  useEffect(() => {
    loadClientDetails();
  }, [id]);

  if (loading) {
    return <Spin />;
  }

  if (!client) {
    return <p>Client not found.</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1>Client Details</h1>
      {!editMode ? (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Client Name">{client.client_name}</Descriptions.Item>
          <Descriptions.Item label="Abbreviation">{client.client_abbreviation}</Descriptions.Item>
          <Descriptions.Item label="Client contact">{client.client_contact}</Descriptions.Item>
          <Descriptions.Item label="Email">{client.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{client.phone}</Descriptions.Item>
          <Descriptions.Item label="Address">{client.address || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="City">{client.city || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Country">{client.country || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Projects Count">{client.project_count || 0}</Descriptions.Item>
        </Descriptions>
      ) : (
        <ClientForm initialValues={client} onSubmit={handleSave} />
      )}

      <div style={{ marginTop: "16px", textAlign: "right" }}>
        {!editMode ? (
          <Button type="primary" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        ) : null}
        <Button style={{ marginLeft: "8px" }} onClick={() => window.history.back()}>
          Back to Clients
        </Button>
      </div>
    </div>
  );
};

export default ClientDetails;
