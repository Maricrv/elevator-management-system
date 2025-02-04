import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, Row, Col, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ProformaForm = ({ initialValues = {}, onSubmit }) => {
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    // Prefill form with initial values
    form.setFieldsValue({
      ...initialValues,
      proforma_date: initialValues?.proforma_date ? moment(initialValues.proforma_date) : null,
      valid_until: initialValues?.valid_until ? moment(initialValues.valid_until) : null,
    });

    // Fetch clients for dropdown
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/clients/`);
        setClients(response.data);
      } catch (error) {
        message.error("Failed to fetch clients.");
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, [form, initialValues]);

  // Handle file upload
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      technical_details_pdf: fileList[0]?.originFileObj || initialValues?.technical_details_pdf,
    };
    onSubmit(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ padding: "16px", background: "#fafafa", borderRadius: "4px" }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Client"
            name="client"
            rules={[{ required: true, message: "Please select a client!" }]}
          >
            <Select placeholder="Select a client" loading={loadingClients}>
              {clients.map((client) => (
                <Option key={client.client_id} value={client.client_id}>
                  {client.client_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Project Name"
            name="project_name"
            rules={[{ required: true, message: "Project name is required!" }]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Proforma Date"
            name="proforma_date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Valid Until"
            name="valid_until"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Total Amount"
            name="total_amount"
            rules={[{ required: true, message: "Enter the total amount!" }]}
          >
            <Input type="number" prefix="$" placeholder="Enter total amount" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Select the status!" }]}
          >
            <Select placeholder="Select status">
              <Option value="Pending">Pending</Option>
              <Option value="Accepted">Accepted</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Enter a description (optional)" />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item label="Technical Details (Order Form PDF)" name="technical_details_pdf">
            <Upload
              fileList={fileList}
              beforeUpload={() => false} // Prevent auto upload
              onChange={handleFileChange}
              accept="application/pdf"
            >
              <Button icon={<UploadOutlined />}>Upload PDF</Button>
            </Upload>
          </Form.Item>
          {initialValues?.technical_details_pdf && (
            <p>
              <a
                href={`${API_BASE_URL}${initialValues.technical_details_pdf}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Existing Order Form (PDF)
              </a>
            </p>
          )}
        </Col>
      </Row>

      <Row justify="end">
        <Col>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button style={{ marginLeft: "8px" }} onClick={() => window.history.back()}>
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ProformaForm;
