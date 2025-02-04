import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const EditProjectAssignment = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/project-assignments/${id}`)
      .then(response => form.setFieldsValue(response.data))
      .catch(error => console.error("Error fetching assignment:", error));
  }, [id, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    await axios.put(`${API_BASE_URL}/api/project-assignments/${id}/`, values);
    setLoading(false);
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Input name="area" placeholder="Area" />
      <Input name="personnel" placeholder="Personnel" />
      <Button type="primary" htmlType="submit" loading={loading}>Update</Button>
    </Form>
  );
};

export default EditProjectAssignment;
