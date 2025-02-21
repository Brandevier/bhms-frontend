import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import BhmsButton from "../../heroComponents/BhmsButton";
import { loginUser } from "../../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const StaffLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true); // Start loading state
    dispatch(loginUser(values))
      .unwrap()
      .then((res) => {
        message.success("Human verification required.");
        navigate("/puzzle-authentication"); // Redirect to puzzle step
      })
      .catch((err) => {
        message.error(err.error || "Login failed. Please try again.");
      })
      .finally(() => {
        setLoading(false); // Stop loading state
      });
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
          src="/assets/login_image.png" // Replace with actual image path
          alt="Doctor"
          style={{ width: "60%", borderRadius: "10px" }}
        />
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
        <Button type="link" href="/login" icon={<LeftOutlined />} style={{ alignSelf: "flex-start" }}>
          Admin Login
        </Button>

        <div className="w-full flex flex-col justify-center items-center">
          <Title level={2} style={{ marginBottom: 10 }}>
            Staff Login
          </Title>
          <Text type="secondary">Facility Manager login portal</Text>

          <Form
            onFinish={onFinish}
            layout="vertical"
            style={{ width: "100%", maxWidth: "400px", marginTop: "20px" }}
          >
            {/* Staff ID */}
            <Form.Item name="staffID" rules={[{ required: true, message: "Enter your staff ID" }]}>
              <Input placeholder="Staff ID" size="large" />
            </Form.Item>

            {/* Password */}
            <Form.Item name="password" rules={[{ required: true, message: "Enter your password" }]}>
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>

            {/* Submit Button with Loader */}
            <Form.Item>
              <BhmsButton htmlType="submit" disabled={loading}>
                {loading ? <Spin size="small" style={{ marginRight: 8 }} /> : null}
                Submit
              </BhmsButton>
            </Form.Item>
          </Form>
        </div>

        {/* Footer */}
        <div className="text-black text-center text-sm shadow-md">
          &copy; {new Date().getFullYear()} BrandeviaHMS. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
