import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Descriptions, Spin, Button, message, Form } from "antd";
import axios from "axios";
import PersonnelForm from "./PersonnelForm";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const PersonnelDetails = () => {
  const { id } = useParams();
  const [personnel, setPersonnel] = useState(null);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm(); // Define the form instance

  const fetchPersonnelDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/personnel/${id}/`);
      setPersonnel(response.data);
    } catch (error) {
      message.error("Failed to fetch personnel details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/areas/`);
      setAreas(response.data);
    } catch (error) {
      message.error("Failed to fetch areas.");
    }
  };

  const handleSave = async (values) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/personnel/${id}/`, values);
      message.success("Personnel updated successfully!");
      setPersonnel(response.data);
      setEditMode(false);
    } catch (error) {
      message.error("Failed to update personnel.");
    }
  };

  useEffect(() => {
    fetchPersonnelDetails();
    fetchAreas();
  }, [id]);

  if (loading) {
    return <Spin />;
  }

  if (!personnel) {
    return <p>Personnel not found.</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1>Personnel Details</h1>
      {!editMode ? (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="First Name">{personnel.firstname}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{personnel.lastname}</Descriptions.Item>
          <Descriptions.Item label="Phone">{personnel.phone}</Descriptions.Item>
          <Descriptions.Item label="Email">{personnel.email}</Descriptions.Item>
          <Descriptions.Item label="Area">{personnel.area_name}</Descriptions.Item>
        </Descriptions>
      ) : (
        <PersonnelForm
          form={form} // Pass the form instance
          initialValues={personnel}
          areas={areas}
          onSubmit={handleSave}
          onCancel={() => setEditMode(false)}
        />
      )}

      <div style={{ marginTop: "16px", textAlign: "right" }}>
        {!editMode ? (
          <Button type="primary" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        ) : (
          <Button onClick={() => setEditMode(false)}>Cancel</Button>
        )}
        <Button style={{ marginLeft: "8px" }} onClick={() => window.history.back()}>
          Back to Personnel List
        </Button>
      </div>
    </div>
  );
};

export default PersonnelDetails;
