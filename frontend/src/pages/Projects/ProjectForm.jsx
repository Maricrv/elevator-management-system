import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Row, Col, DatePicker, message } from "antd";
import moment from "moment";
import axios from "axios";

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ProjectForm = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/project-statuses/`);
      setStatusOptions(response.data);
    } catch (error) {
      message.error("Failed to fetch project statuses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        start_date: initialValues.start_date ? moment(initialValues.start_date) : null,
        end_date: initialValues.end_date ? moment(initialValues.end_date) : null,
      }}
      onFinish={async (values) => {
        try {
          const formattedValues = {
            ...values,
            start_date: values.start_date ? values.start_date.format("YYYY-MM-DD") : null,
            end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
          };
          await onSubmit(formattedValues);
          form.resetFields();
        } catch (error) {
          message.error("Error saving project. Please check your input.");
        }
      }}
      style={{ background: "#fafafa", padding: "16px", borderRadius: "4px" }}
    >
      <Row gutter={16}>
        <Col span={12}><Form.Item label="Project ID"><Input value={initialValues.project_id} disabled /></Form.Item></Col>
        <Col span={12}><Form.Item label="Client"><Input value={initialValues.client_name || "No Client Assigned"} disabled /></Form.Item></Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}><Form.Item label="Project Name" name="project_name" rules={[{ required: true, message: "Project Name is required" }]}><Input /></Form.Item></Col>
        <Col span={12}><Form.Item label="Status" name="status" rules={[{ required: true, message: "Please select a status" }]}><Select loading={loading} placeholder="Select project status">{statusOptions.map((status) => (<Option key={status.status_id} value={status.status_id}>{status.description}</Option>))}</Select></Form.Item></Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}><Form.Item label="Start Date" name="start_date" rules={[{ required: true, message: "Please select a start date" }]}><DatePicker style={{ width: "100%" }} /></Form.Item></Col>
        <Col span={12}><Form.Item label="End Date" name="end_date" rules={[{ required: true, message: "Please select an end date" }]}><DatePicker style={{ width: "100%" }} /></Form.Item></Col>
      </Row>
      <Row gutter={16}><Col span={24}><Form.Item label="Notes" name="notes"><Input.TextArea rows={4} placeholder="Enter project notes" /></Form.Item></Col></Row>
      <Row justify="end"><Col><Button type="primary" htmlType="submit">Save</Button></Col></Row>
    </Form>
  );
};

export default ProjectForm;
