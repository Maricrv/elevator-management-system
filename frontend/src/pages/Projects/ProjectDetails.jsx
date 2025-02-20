// ProjectDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Descriptions, Spin, Button, message, Modal } from "antd";
import axios from "axios";
import ProjectForm from "./ProjectForm";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const loadProjectDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/projects/${id}/`);
      setProject(response.data);
    } catch (error) {
      message.error("Failed to fetch project details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    try {
      const formattedValues = {
        project_name: values.project_name,
        client_id: values.client_id,
        status: values.status,
        start_date: values.start_date ? values.start_date.format("YYYY-MM-DD") : null,
        end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
        notes: values.notes || "",
      };

      await axios.put(`${API_BASE_URL}/api/projects/${id}/`, formattedValues);
      message.success("Project updated successfully!");
      setIsModalVisible(false);
      loadProjectDetails();
    } catch (error) {
      message.error("Failed to update project. Check required fields.");
    }
  };

  useEffect(() => {
    loadProjectDetails();
  }, [id]);

  if (loading) {
    return <Spin />;
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "16px" }}>
      <h1>Project Details</h1>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Project ID">{project.project_id}</Descriptions.Item>
        <Descriptions.Item label="Project Name">{project.project_name}</Descriptions.Item>
        <Descriptions.Item label="Client">{project.client_name || "No Client Assigned"}</Descriptions.Item>
        <Descriptions.Item label="Start Date">{project.start_date}</Descriptions.Item>
        <Descriptions.Item label="End Date">{project.end_date}</Descriptions.Item>
        <Descriptions.Item label="Status">{project.status_name}</Descriptions.Item>
        <Descriptions.Item label="Notes">{project.notes || "No notes available."}</Descriptions.Item>
      </Descriptions>
      <div style={{ marginTop: "16px", textAlign: "right" }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>Edit</Button>
        <Button style={{ marginLeft: "8px" }} onClick={() => navigate(-1)}>Back to Projects</Button>
      </div>
      <Modal
        title="Edit Project"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <ProjectForm initialValues={project} onSubmit={handleSave} />
      </Modal>
    </div>
  );
};

export default ProjectDetails;