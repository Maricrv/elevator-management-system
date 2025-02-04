import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Descriptions, Spin, message } from "antd";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ProjectAssignmentDetails = () => {
  const { id } = useParams(); // Obtener ID de la URL
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/project-assignments/${id}/`);
        setAssignment(response.data);
      } catch (error) {
        message.error("Failed to fetch assignment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentDetails();
  }, [id]);

  if (loading) return <Spin />;
  if (!assignment) return <p>Assignment not found.</p>;

  return (
    <Descriptions bordered>
      <Descriptions.Item label="Project">{assignment.project}</Descriptions.Item>
      <Descriptions.Item label="Area">{assignment.area_name}</Descriptions.Item>
      <Descriptions.Item label="Personnel">{assignment.personnel_name}</Descriptions.Item>
      <Descriptions.Item label="Status">{assignment.area_status}</Descriptions.Item>
    </Descriptions>
  );
};

export default ProjectAssignmentDetails;
