import React, { useEffect } from "react";
import { Form, Input, Button, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";

const ClientForm = ({ initialValues = {}, onSubmit }) => {
  const [form] = Form.useForm();


  useEffect(() => {
    // Prefill form with initial values if provided
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  const handleFinish = (values) => {
    onSubmit(values);
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
            label="Client Name"
            name="client_name"
            rules={[{ required: true, message: "Please enter the client name" }]}
          >
            <Input placeholder="Enter client name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Abbreviation"
            name="client_abbreviation"
            rules={[{ required: true, message: "Please enter an abbreviation" }]}
          >
            <Input placeholder="Enter abbreviation" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
      <Col span={12}>
          <Form.Item
            label="Client contact"
            name="client_contact"
            rules={[{ required: true, message: "Please enter the client contact" }]}
          >
            <Input placeholder="Enter client contact" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
        </Col>

      </Row>

      <Row gutter={16}>
      <Col span={12}>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter a phone number" },
              { pattern: /^[0-9]{7,15}$/, message: "Invalid phone number" },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter the client’s address" }]}
          >
            <Input placeholder="Enter address" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
      <Col span={12}>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please enter the city" }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please enter the country" }]}
          >
            <Input placeholder="Enter country" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Project Count"
            name="project_count"
            rules={[{ required: true, type: "number", min: 0, message: "Enter a valid project count" }]}
            normalize={(value) => (value ? Number(value) : 0)} // Ensures numeric input
          >
            <Input type="number" placeholder="Enter number of projects" />
          </Form.Item>
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

export default ClientForm;
