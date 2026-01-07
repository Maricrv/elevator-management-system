import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Input, Button, Select, Typography, Space, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, IdcardOutlined } from "@ant-design/icons";
import { register } from "../services/authService";

const { Title, Text } = Typography;

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { username, email, password, confirmPassword, role } = values;

    if (password !== confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register({ username, email, password, role });
      message.success("Registration successful! Redirecting...");

      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      message.error(
        "Registration failed: " +
          (error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
      className="login-page-container"
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 14,
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: 28 }}
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }} align="center">
          {/* Logo */}
          <img
            src="/img1 logo.jpg"
            alt="ElevatorSys Logo"
            style={{ height: 64, objectFit: "contain" }}
          />

          <Title level={3} style={{ margin: 0, color: "#162d50" }}>
            Create an Account
          </Title>

          <Text type="secondary" style={{ textAlign: "center" }}>
            Register to access the ElevatorSys dashboard
          </Text>
        </Space>

        <div style={{ height: 18 }} />

        <Form layout="vertical" onFinish={handleSubmit} initialValues={{ role: "Technician" }}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please enter a username" },
              { min: 3, message: "Username must be at least 3 characters" },
            ]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter an email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true, message: "Please confirm your password" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item label="Role" name="role" rules={[{ required: true, message: "Select a role" }]}>
            <Select size="large" prefix={<IdcardOutlined />}>
              <Select.Option value="Technician">Technician</Select.Option>
              <Select.Option value="Admin">Admin</Select.Option>
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{ marginTop: 8 }}
          >
            Register
          </Button>

          <div style={{ marginTop: 14, textAlign: "center" }}>
            <Text type="secondary">
              Already have an account? <Link to="/">Login</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterForm;
