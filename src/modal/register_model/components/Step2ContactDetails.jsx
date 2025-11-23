import React, { useEffect } from "react";
import { Form, Input, Select, Row, Col, Typography } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const Step2ContactDetails = ({ form, initialValues }) => {
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  return (
    <div className="space-y-6">
      <div>
        <Title level={4} className="!mb-2">Contact Information</Title>
        <Text type="secondary">How can we reach the patient?</Text>
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item 
            label="Phone Number" 
            name="phone_number" 
            rules={[{ required: true, message: "Phone number is required" }]}
          >
            <Input 
              placeholder="Enter phone number" 
              size="large" 
              type="tel"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            label="Email" 
            name="email" 
            rules={[{ type: "email", message: "Enter a valid email" }]}
          >
            <Input placeholder="Enter email" size="large" type="email" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item 
            label="City" 
            name="city" 
            rules={[{ required: true, message: "City is required" }]}
          >
            <Input placeholder="Enter city" size="large" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            label="Country" 
            name="country" 
            rules={[{ required: true, message: "Select country" }]}
          >
            <Select placeholder="Select country" size="large">
              <Option value="Ghana">Ghana</Option>
              <Option value="Nigeria">Nigeria</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item 
        label="Address" 
        name="address" 
        rules={[{ required: true, message: "Address is required" }]}
      >
        <Input.TextArea rows={3} placeholder="Enter full address" />
      </Form.Item>
    </div>
  );
};

export default Step2ContactDetails;