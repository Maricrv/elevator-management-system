import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Descriptions, Spin, Button, message, Modal } from "antd";
import axios from "axios";
import EditAssignmentForm from "./EditAssignmentForm"; // ✅ Import the form for editing

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ProjectAssignmentDetails = () => {
  const { id } = useParams();  // 🔹 Get the assignment ID from the URL
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!id) {
      message.error("Invalid assignment ID.");
      return;
    }
    fetchAssignmentDetails();
  }, [id]);

  // ✅ Fetch the assignment details
  const fetchAssignmentDetails = async () => {
    setLoading(true);
    try {
      console.log("🔍 Fetching details for ID:", id); // Debugging
  
      const response = await axios.get(`${API_BASE_URL}/api/project-assignments/${id}/`);
  
      console.log("✅ API Response:", response.data); // Check response
      setAssignment(response.data);
    } catch (error) {
      console.error("❌ API Error:", error.response?.data);
      message.error(`Failed to fetch assignment details: ${JSON.stringify(error.response?.data)}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle saving the updated assignment
  const handleSaveAssignment = async (values) => {
    try {
      await axios.put(`${API_BASE_URL}/api/project-assignments/${id}/`, values);
      message.success("Assignment updated successfully!");
      fetchAssignmentDetails(); // Refresh details
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update assignment.");
      console.error("Update Error:", error.response?.data);
    }
  };

  if (loading) return <Spin />;
  if (!assignment) return <p>Assignment not found.</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "16px" }}>
      <h1>Project Assignment Details</h1>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Assignment ID">{assignment.id}</Descriptions.Item>
        <Descriptions.Item label="Project">{assignment.project}</Descriptions.Item>
        <Descriptions.Item label="Area">{assignment.area_name}</Descriptions.Item>
        <Descriptions.Item label="Personnel">{assignment.personnel_name}</Descriptions.Item>
        <Descriptions.Item label="Status">{assignment.status_description || "No Status Assigned"}</Descriptions.Item>
      </Descriptions>

      {/* ✅ Buttons for actions */}
      <div style={{ marginTop: "16px", textAlign: "right" }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>Edit</Button>
        <Button style={{ marginLeft: "8px" }} onClick={() => navigate(-1)}>Back to Assignments</Button>
      </div>

      {/* ✅ Modal for Editing */}
      <Modal
        title="Edit Assignment"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <EditAssignmentForm initialValues={assignment} onSubmit={handleSaveAssignment} />
      </Modal>
    </div>
  );
};

export default ProjectAssignmentDetails;
