import React, { useEffect } from "react";
import { Form, Input, Select, DatePicker, Row, Col, Typography } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const Step1PersonalInfo = ({ form, initialValues }) => {
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  return (
    <div className="space-y-6">
      <div>
        <Title level={4} className="!mb-2">Basic Information</Title>
        <Text type="secondary">Enter the patient's personal details</Text>
      </div>
      
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item 
            label="First Name" 
            name="first_name" 
            rules={[{ required: true, message: "First name is required" }]}
          >
            <Input placeholder="Enter first name" size="large" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Middle Name" name="middle_name">
            <Input placeholder="Enter middle name" size="large" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            label="Last Name" 
            name="last_name" 
            rules={[{ required: true, message: "Last name is required" }]}
          >
            <Input placeholder="Enter last name" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item 
            label="Gender" 
            name="gender" 
            rules={[{ required: true, message: "Select gender" }]}
          >
            <Select placeholder="Select gender" size="large">
              <Option value="M">Male</Option>
              <Option value="F">Female</Option>
              <Option value="O">Other</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            label="Date of Birth" 
            name="date_of_birth" 
            rules={[{ required: true, message: "Select date of birth" }]}
          >
            <DatePicker 
              style={{ width: "100%" }} 
              size="large" 
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            label="Religion" 
            name="religion"
          >
            <Select placeholder="Select religion" size="large">
              <Option value="Christianity">Christianity</Option>
              <Option value="Islam">Islam</Option>
              <Option value="Traditional">Traditional</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default Step1PersonalInfo;