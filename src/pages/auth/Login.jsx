import React from "react";
import { Card, Form, Input, Button, Typography, Layout } from "antd";

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const onFinish = (values) => {
    console.log("Received values:", values);
    // Add your login logic here
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            width: 400,
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Title */}
          <Title level={3} style={{ marginBottom: 24 }}>
            Telemedicine at Destination
          </Title>

          {/* Subtitle */}
          <Title level={5} style={{ marginBottom: 24 }}>
            Admin Login
          </Title>

          {/* Login Form */}
          <Form name="login" onFinish={onFinish}>
            {/* Username Field */}
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Username" size="large" />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{ marginTop: 16 }}
              >
                Continue
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;