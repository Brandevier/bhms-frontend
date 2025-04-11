import React, { useEffect } from "react";
import { Form, Input, Button, Typography, Spin, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import BhmsButton from "../../heroComponents/BhmsButton";
import { loginAdmin } from "../../redux/slice/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error, admin } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) {
      navigate("/admin");
    }
  }, [admin, navigate]);

  const onFinish = (values) => {
    // Trim whitespace from email and password before submitting
    const trimmedValues = {
      email: values.email.trim(),
      password: values.password.trim(),
    };
  
    dispatch(loginAdmin(trimmedValues))
      .unwrap()
      .then((res) => {
        console.log(res);
        message.success("OTP sent successfully!");
        localStorage.setItem("email", trimmedValues.email);
        navigate("/admin");
      })
      .catch((err) => {
        message.error(err.error || "Login failed. Please try again.");
      });
  };
  

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Side - Image & Labels (Hidden on small devices) */}
      <div className="hidden md:flex flex-1 bg-blue-50 justify-center items-center flex-col p-5">
        <img
          src="/assets/login_image.png" // Replace with the actual doctor image
          alt="Doctor"
          className="w-3/5 rounded-lg"
        />

        <div className="absolute top-1/2 right-1/4 bg-white p-5 rounded-lg shadow-md">
          <br />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-between items-center p-10 bg-white">
        {/* Back Button */}
        <Button
          type="link"
          href="/hms/staff_login"
          icon={<LeftOutlined />}
          className="self-start"
        >
          Staff Login
        </Button>

        {/* Login Form */}
        <div className="w-full flex flex-col justify-center items-center">
          <Title level={2} className="mb-2">
            Admin Login
          </Title>
          <Text type="secondary" className="mb-2">Facility Manager login portal</Text>

          <Form
            onFinish={onFinish}
            layout="vertical"
            className="w-full max-w-md mt-5"
          >
            {/* Email Input */}
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Enter your email" }]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>

            {/* Password Input */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Enter your password" }]}
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <BhmsButton type="submit" htmlType="submit" loading={loading}>
                {loading ? <Spin /> : "Submit"}
              </BhmsButton>
            </Form.Item>
          </Form>

          {/* Error Message */}
          {error && (
            <div className="mt-3">
              <Text type="danger">{error.error}</Text>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-black text-center text-sm shadow-md">
          &copy; {new Date().getFullYear()} BrandeviaHMS. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;