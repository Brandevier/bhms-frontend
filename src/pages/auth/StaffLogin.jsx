import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Spin, Divider } from "antd";
import { LeftOutlined, LockOutlined, IdcardOutlined } from "@ant-design/icons";
import { loginUser } from "../../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BhmsButton from "../../heroComponents/BhmsButton";

const { Title, Text } = Typography;

const StaffLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true); 

    const trimmedValues = {
      staffID: values.staffID.trim(),
      password: values.password.trim(),
    };

    dispatch(loginUser(trimmedValues))
      .unwrap()
      .then((res) => {
        message.success("Human verification required.");
        navigate("/hms/puzzle-authentication");
      })
      .catch((err) => {
        message.error(err.error || "Login failed. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F7F9FC]">
      {/* Left Side - Branding */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#00DFA2] to-[#19417D] flex flex-col justify-center items-center p-10 text-white relative">
        <div className="mb-10 flex flex-col items-center">
          <img 
            src="/assets/logo_2.png" 
            alt="Tonitel Logo" 
            className="h-16 mb-6"
          />
          <Title level={2} className="text-white mb-2">Staff Portal</Title>
          <Text className="text-white/80">Healthcare Team Access</Text>
        </div>
        
        <div className="max-w-md">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
            <div className="flex items-start mb-6">
              <div className="text-2xl mr-4">👩⚕️</div>
              <div>
                <Text strong className="text-white block">Secure Staff Access</Text>
                <Text className="text-white/70">Dedicated portal for medical professionals</Text>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-2xl mr-4">🔐</div>
              <div>
                <Text strong className="text-white block">Role-Based Permissions</Text>
                <Text className="text-white/70">Access tailored to your responsibilities</Text>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Login Link */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <Button 
            type="link" 
            className="text-white hover:text-white/80"
            icon={<LeftOutlined />}
            onClick={() => navigate("/hms/login")}
          >
            Admin Login
          </Button>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <Title level={3} className="mb-1">Staff Authentication</Title>
          <Text type="secondary" className="mb-8 block">Enter your staff credentials</Text>

          <Form
            onFinish={onFinish}
            layout="vertical"
            className="w-full"
          >
            <Form.Item
              name="staffID"
              rules={[{ required: true, message: 'Please input your staff ID' }]}
            >
              <Input 
                prefix={<IdcardOutlined className="text-gray-400" />} 
                placeholder="Staff ID" 
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
                {loading ? <Spin /> : 'Verify Identity'}
              </BhmsButton>
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <Button type="link" className="p-0 text-gray-600">Forgot credentials?</Button>
            </div>

            <Divider plain className="text-gray-400">Security Notice</Divider>

            <div className="text-center">
              <Text className="text-gray-600 text-sm">
                After login, you'll complete a human verification puzzle
              </Text>
            </div>
          </Form>
        </div>

        <div className="mt-auto pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Tonitel. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;