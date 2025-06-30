import React, { useState } from 'react';
import { Steps, Form, Input, Button, Card, Typography, message } from 'antd';
import { motion } from 'framer-motion';
import { 
  BankOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined,
  IdcardOutlined
} from '@ant-design/icons';

const { Step } = Steps;
const { Title, Text } = Typography;

const InstitutionRegistration = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [institutionForm] = Form.useForm();

  const steps = [
    {
      title: 'Institution Information',
      content: 'First-content',
    },
    {
      title: 'Admin Account',
      content: 'Second-content',
    },
  ];

  const onFinishInstitution = (values) => {
    console.log('Institution values:', values);
    setCurrentStep(currentStep + 1);
  };

  const onFinishAdmin = (values) => {
    console.log('Admin values:', values);
    message.success('Registration successful!');
    // Here you would submit both forms data to your backend
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { opacity: 0 }
  };

  const formVariants = {
    hidden: { x: currentStep === 0 ? -50 : 50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
    >
      <Card className="w-full max-w-3xl shadow-lg">
        <div className="text-center mb-8">
          <Title level={3}>Create Your Institution Account</Title>
          <Text type="secondary">Complete these steps to set up your healthcare institution</Text>
        </div>

        <Steps current={currentStep} className="mb-8">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <motion.div
          key={currentStep}
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          {currentStep === 0 && (
            <Form
              form={institutionForm}
              name="institution"
              onFinish={onFinishInstitution}
              layout="vertical"
            >
              <Form.Item
                name="name"
                label="Institution Name"
                rules={[{ required: true, message: 'Please input your institution name!' }]}
              >
                <Input 
                  prefix={<BankOutlined />} 
                  placeholder="e.g. Komfo Anokye Teaching Hospital" 
                />
              </Form.Item>

              <Form.Item
                name="address"
                label="Physical Address"
                rules={[{ required: true, message: 'Please input your address!' }]}
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="Full physical address of your institution" 
                />
              </Form.Item>

              <Form.Item
                name="contact"
                label="Contact Phone"
                rules={[{ required: true, message: 'Please input your contact number!' }]}
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="e.g. +233 24 123 4567" 
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Institution Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="institution@example.com" 
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description (Optional)"
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="Brief description about your institution" 
                />
              </Form.Item>

              <Form.Item className="flex justify-end">
                <Button type="primary" htmlType="submit">
                  Next: Admin Account
                </Button>
              </Form.Item>
            </Form>
          )}

          {currentStep === 1 && (
            <Form
              form={form}
              name="admin"
              onFinish={onFinishAdmin}
              layout="vertical"
            >
              <Form.Item
                name="username"
                label="Admin Username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Choose a username" 
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Admin Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="admin@example.com" 
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Create a strong password" 
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Confirm your password" 
                />
              </Form.Item>

              <Form.Item className="flex justify-between">
                <Button onClick={prev}>
                  Previous
                </Button>
                <Button type="primary" htmlType="submit">
                  Complete Registration
                </Button>
              </Form.Item>
            </Form>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default InstitutionRegistration;