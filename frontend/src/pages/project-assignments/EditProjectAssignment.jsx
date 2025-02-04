import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, message, Spin } from "antd";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const EditProjectAssignment = () => {
  const { id } = useParams(); // Obtener ID de la URL
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/project-assignments/${id}/`);
        setAssignment(response.data);
      } catch (error) {
        message.error("Failed to fetch assignment.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  const handleUpdate = async (values) => {
    try {
      await axios.put(`${API_BASE_URL}/api/project-assignments/${id}/`, values);
      message.success("Assignment updated successfully.");
      navigate("/project-assignments");
    } catch (error) {
      message.error("Failed to update assignment.");
    }
  };

  if (loading) return <Spin />;
  if (!assignment) return <p>Assignment not found.</p>;

  return (
    <Form
      layout="vertical"
      initialValues={{
        area: assignment.area,
        personnel: assignment.personnel,
        area_status: assignment.area_status,
      }}
      onFinish={handleUpdate}
    >
      <Form.Item label="Area" name="area" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Personnel" name="personnel" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Status" name="area_status">
        <Select>
          <Select.Option value={1}>Active</Select.Option>
          <Select.Option value={2}>Inactive</Select.Option>
        </Select>
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
};

export default EditProjectAssignment;
