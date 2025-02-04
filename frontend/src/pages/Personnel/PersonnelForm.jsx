import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchAreas } from "../../services/areaService"; // Fetch areas from API

const { Option } = Select;

const PersonnelForm = ({ initialValues = {}, onSubmit }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);

  useEffect(() => {
    // Prefill form with initial values if provided
    form.setFieldsValue(initialValues);

    // Fetch areas dynamically
    const loadAreas = async () => {
      setLoadingAreas(true);
      try {
        const data = await fetchAreas();
        setAreas(data);
      } catch (error) {
        message.error("Failed to fetch areas.");
      } finally {
        setLoadingAreas(false);
      }
    };

    loadAreas();
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
            label="First Name"
            name="firstname"
            rules={[{ required: true, message: "Please enter the first name" }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Last Name"
            name="lastname"
            rules={[{ required: true, message: "Please enter the last name" }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter the phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter an email address" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Area"
            name="area"
            rules={[{ required: true, message: "Please select an area" }]}
          >
            <Select
              placeholder="Select an area"
              loading={loadingAreas}
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {areas.map((area) => (
                <Option key={area.area_id} value={area.area_id}>
                  {area.area_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row justify="end">
        <Col>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button style={{ marginLeft: "8px" }} onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default PersonnelForm;
