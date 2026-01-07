import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/login/`, values);

      message.success("Login successful");
      onLogin();
      navigate("/dashboard");
    } catch (error) {
      message.error(
        error.response?.data?.error || "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e9eff6, #d3dbe5)",
      }}
    >
      <Content
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <Card
          style={{
            maxWidth: 900,
            width: "100%",
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <Row>
            {/* LEFT IMAGE */}
            <Col
              xs={0}
              md={10}
              style={{
                backgroundImage: "url('/cologne.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* RIGHT FORM */}
            <Col xs={24} md={14}>
              <div
                style={{
                  padding: "48px 40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                {/* LOGO */}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <img
                    src="/img1 logo.jpg"
                    alt="ElevatorSys"
                    style={{ height: 60, marginBottom: 12 }}
                  />
                  <Title level={4} style={{ marginBottom: 0 }}>
                    ElevatorSys
                  </Title>
                  <Text type="secondary">
                    Sign in to manage your operations
                  </Text>
                </div>

                {/* FORM */}
                <Form
                  layout="vertical"
                  onFinish={handleLogin}
                  requiredMark={false}
                >
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: "Enter your username" }]}
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
                    rules={[{ required: true, message: "Enter your password" }]}
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
                    style={{
                      marginTop: 12,
                      height: 44,
                      fontWeight: 600,
                    }}
                  >
                    Login
                  </Button>
                </Form>

                {/* LINKS */}
                <div
                  style={{
                    marginTop: 24,
                    textAlign: "center",
                  }}
                >
                  <Text type="secondary">
                    Don’t have an account?{" "}
                    <Link to="/register">Register here</Link>
                  </Text>
                  <br />
                  <Link to="#" style={{ fontSize: 13 }}>
                    Forgot password?
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
}

export default LoginPage;
