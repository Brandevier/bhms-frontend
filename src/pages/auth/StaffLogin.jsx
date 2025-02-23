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
    <div className="flex h-screen bg-gray-50">
      {/* Left Side - Image & Labels (Hidden on small devices) */}
      <div className="hidden md:flex flex-1 bg-blue-50 justify-center items-center flex-col p-5">
        <img
          src="/assets/login_image.png" // Replace with actual image path
          alt="Doctor"
          className="w-3/5 rounded-lg"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-between items-center p-10 bg-white">
        {/* Back Button */}
        <Button
          type="link"
          href="/login"
          icon={<LeftOutlined />}
          className="self-start"
        >
          Admin Login
        </Button>

        {/* Login Form */}
        <div className="w-full flex flex-col justify-center items-center">
          <Title level={2} className="mb-2">
            Staff Login
          </Title>
          <Text type="secondary" className="mb-2">Facility Manager login portal</Text>

          <Form
            onFinish={onFinish}
            layout="vertical"
            className="w-full max-w-md mt-5"
          >
            {/* Staff ID */}
            <Form.Item
              name="staffID"
              rules={[{ required: true, message: "Enter your staff ID" }]}
            >
              <Input placeholder="Staff ID" size="large" />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Enter your password" }]}
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>

            {/* Submit Button with Loader */}
            <Form.Item>
              <BhmsButton htmlType="submit" disabled={loading}>
                {loading ? <Spin size="small" className="mr-2" /> : null}
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