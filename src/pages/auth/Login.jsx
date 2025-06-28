import React, { useEffect } from "react";
import { Form, Input, Button, Typography, Spin, message, Divider } from "antd";
import { LeftOutlined, LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BhmsButton from "../../heroComponents/BhmsButton";

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
    const trimmedValues = {
      email: values.email.trim(),
      password: values.password.trim(),
    };
  
    dispatch(loginAdmin(trimmedValues))
      .unwrap()
      .then(() => {
        message.success("Login successful!");
        localStorage.setItem("email", trimmedValues.email);
        navigate("/admin");
      })
      .catch((err) => {
        message.error(err.error || "Login failed. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F7F9FC]">
      {/* Left Side - Branding */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#19417D] to-[#00DFA2] flex flex-col justify-center items-center p-10 text-white relative">
        <div className="mb-10 flex flex-col items-center">
          <img 
            src="/assets/logo_2.png" 
            alt="Tonitel Logo" 
            className="h-16 mb-6"
          />
          <Title level={2} className="text-white mb-2">Welcome Back</Title>
          <Text className="text-white/80">Healthcare Management Simplified</Text>
        </div>
        
        <div className="max-w-md">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
            <div className="flex items-start mb-6">
              <div className="text-2xl mr-4">🏥</div>
              <div>
                <Text strong className="text-white block">Centralized Patient Data</Text>
                <Text className="text-white/70">Access all patient records in one secure platform</Text>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-2xl mr-4">📊</div>
              <div>
                <Text strong className="text-white block">Real-time Analytics</Text>
                <Text className="text-white/70">Make data-driven decisions with live insights</Text>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Login Link - Added to bottom left */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <Button 
            type="link" 
            className="text-white hover:text-white/80"
            icon={<UserOutlined />}
            onClick={() => navigate("/hms/staff_login")}
          >
            Login as Staff Member
          </Button>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
            className="self-start mb-6 text-gray-600"
          >
            Back
          </Button>

          <Title level={3} className="mb-1">Admin Portal Login</Title>
          <Text type="secondary" className="mb-8 block">Enter your credentials to access the dashboard</Text>

          <Form
            onFinish={onFinish}
            layout="vertical"
            className="w-full"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-gray-400" />} 
                placeholder="Email address" 
                size="large"
                className="py-2"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password' }]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password" 
                size="large"
                className="py-2"
              />
            </Form.Item>

            <Form.Item className="mb-4">
              <BhmsButton 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
              >
                {loading ? <Spin /> : 'Login'}
              </BhmsButton>
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <Button type="link" className="p-0 text-gray-600">Forgot password?</Button>
            </div>

            <Divider plain className="text-gray-400">or</Divider>

            <div className="text-center">
              <Text className="text-gray-600">Need an account? </Text>
              <Button type="link" className="p-0">Contact administrator</Button>
            </div>
          </Form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <Text type="danger">{error.error || 'Invalid credentials'}</Text>
            </div>
          )}
        </div>

        <div className="mt-auto pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Tonitel. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;