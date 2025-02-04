import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ProjectAssignmentsList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/project-assignments/`);
      setAssignments(response.data);
    } catch (error) {
      message.error("Failed to fetch project assignments.");
    }
    setLoading(false);
  };

  const columns = [
    { title: "Project ID", dataIndex: "project", key: "project" },
    { title: "Area", dataIndex: "area", key: "area" },
    { title: "Personnel", dataIndex: "personnel", key: "personnel" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button onClick={() => navigate(`/project-assignments/details/${record.id}`)}>Details</Button>
          <Button onClick={() => navigate(`/project-assignments/edit/${record.id}`)}>Edit</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Project Assignments</h2>
      <Table dataSource={assignments} columns={columns} loading={loading} rowKey="id" />
    </div>
  );
};

export default ProjectAssignmentsList;
