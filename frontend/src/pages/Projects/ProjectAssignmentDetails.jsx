import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ProjectAssignmentDetails = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/project-assignments/${id}`)
      .then(response => setAssignment(response.data))
      .catch(error => console.error("Error fetching details:", error));
  }, [id]);

  if (!assignment) return <p>Loading...</p>;

  return (
    <div>
      <h2>Project Assignment Details</h2>
      <p><strong>Project:</strong> {assignment.project}</p>
      <p><strong>Area:</strong> {assignment.area}</p>
      <p><strong>Personnel:</strong> {assignment.personnel}</p>
      <p><strong>Status:</strong> {assignment.area_status}</p>
    </div>
  );
};

export default ProjectAssignmentDetails;
