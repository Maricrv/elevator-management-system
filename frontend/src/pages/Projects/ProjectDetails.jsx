import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Descriptions, Spin, Button, message } from "antd";
import axios from "axios";
import ProjectForm from "./ProjectForm";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Fetch project details
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

  // Handle project update

  const handleSave = async (values) => {
  try {
    // ✅ Format request data correctly
    const formattedValues = {
      project_name: values.project_name,
      client_id: values.client_id, // Ensure this is sent correctly
      status: values.status, // Send status ID, not text
      start_date: values.start_date ? values.start_date.format("YYYY-MM-DD") : null,
      end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
      notes: values.notes || "", // Ensure notes are included
    };

    console.log("Sending data to API:", formattedValues); // Debugging

    // ✅ Send PUT request
    const response = await axios.put(`${API_BASE_URL}/api/projects/${id}/`, formattedValues);

    message.success("Project updated successfully!");
    setProject(response.data);
    setEditMode(false);
  } catch (error) {
    console.error("API Error:", error.response?.data); // Debugging
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

      {!editMode ? (
        <>
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
            <Button type="primary" onClick={() => setEditMode(true)}>
              Edit
            </Button>
            <Button style={{ marginLeft: "8px" }} onClick={() => window.history.back()}>
              Back to Projects
            </Button>
          </div>
        </>
      ) : (
        <>
          <ProjectForm
            initialValues={project}
            onSubmit={handleSave}
          />
          <div style={{ marginTop: "16px", textAlign: "right" }}>
            <Button
              style={{ marginLeft: "8px" }}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
