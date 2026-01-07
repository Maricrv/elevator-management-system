import React, { useState, useContext } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { login } from "../services/authService";
import AuthContext from "../context/AuthContext";

const { Title, Text } = Typography;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const { login: loginUser } = useContext(AuthContext);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const data = await login(values);

      // Save auth info
      loginUser(data.user);
      localStorage.setItem("token", data.access);

      message.success("Login successful");
    } catch (error) {
      message.error("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "0 auto" }}>
      <Title level={4} style={{ textAlign: "center" }}>
        Sign in
      </Title>
      <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 24 }}>
        Enter your credentials to continue
      </Text>

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Username"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          icon={<LoginOutlined />}
          loading={loading}
          size="large"
          block
          style={{ marginTop: 12 }}
        >
          Login
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
