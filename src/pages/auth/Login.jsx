import React from "react";
import { Form, Input, Button, Typography } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import BhmsButton from "../../heroComponents/BhmsButton";


const { Title, Text } = Typography;

const Login = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* Left Side - Image & Labels */}
      <div
        style={{
          flex: 1,
          background: "#F2F7FF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <img
          src="/assets/login_image.png" // Replace with the actual doctor image
          alt="Doctor"
          style={{ width: "60%", borderRadius: "10px" }}
        />

        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "20%",
            background: "#fff",
            padding: "10px 20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <br />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
          padding: "40px",
          background: "#ffffff",
        }}
      >
        <Button type="link" icon={<LeftOutlined />} style={{ alignSelf: "flex-start" }}>
          LOGIN AS STAFF
        </Button>
        <div className="w-full flex flex-col justify-center items-center">
          <Title level={2} style={{ marginBottom: 10 }}>
            Admin Login
          </Title>
          <Text type="secondary">Facility Manager login portal</Text>

          <Form
            onFinish={onFinish}
            layout="vertical"
            style={{ width: "100%", maxWidth: "400px", marginTop: "20px" }}
          >
            <Form.Item name="email" rules={[{ required: true, message: "Enter your email" }]}>
              <Input placeholder="Email" size="large" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "Enter your password" }]}>
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>
            <Form.Item>
              <BhmsButton onClick={() => console.log("Clicked!")}>
                Submit
              </BhmsButton>

            </Form.Item>
          </Form>

        </div>
        <div className=" text-black text-center text-sm shadow-md">
          {/* &copy; {new Date().getFullYear()} BrandeviaHMS. All rights reserved. */}
        </div>
      </div>
    </div>
  );
};

export default Login;
