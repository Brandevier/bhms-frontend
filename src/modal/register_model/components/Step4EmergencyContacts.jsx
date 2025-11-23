import React, { useEffect } from "react";
import { Form, Input, Select, Row, Col, Typography, Card } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const Step4EmergencyContacts = ({ form, initialValues }) => {
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  return (
    <div className="space-y-8">
      <div>
        <Title level={4} className="!mb-2">Emergency Contacts</Title>
        <Text type="secondary">Who should we contact in case of emergency?</Text>
      </div>

      <Card title="Next of Kin" className="shadow-sm">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item 
              label="Name" 
              name="next_of_kin_name"
              rules={[{ required: true, message: "Next of kin name is required" }]}
            >
              <Input placeholder="Enter full name" size="large" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              label="Phone" 
              name="next_of_kin_phone"
              rules={[{ required: true, message: "Next of kin phone is required" }]}
            >
              <Input placeholder="Enter phone number" size="large" type="tel" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              label="Relationship" 
              name="next_of_kin_relationship"
              rules={[{ required: true, message: "Relationship is required" }]}
            >
              <Select placeholder="Select relationship" size="large">
                <Option value="Spouse">Spouse</Option>
                <Option value="Parent">Parent</Option>
                <Option value="Child">Child</Option>
                <Option value="Sibling">Sibling</Option>
                <Option value="Brother">Brother</Option>
                <Option value="Sister">Sister</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Emergency Contact" className="shadow-sm">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item 
              label="Name" 
              name="emergency_contact_name"
              rules={[{ required: true, message: "Emergency contact name is required" }]}
            >
              <Input placeholder="Enter full name" size="large" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              label="Phone" 
              name="emergency_contact_phone"
              rules={[{ required: true, message: "Emergency contact phone is required" }]}
            >
              <Input placeholder="Enter phone number" size="large" type="tel" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              label="Relationship" 
              name="emergency_contact_relationship"
              rules={[{ required: true, message: "Relationship is required" }]}
            >
              <Select placeholder="Select relationship" size="large">
                <Option value="Spouse">Spouse</Option>
                <Option value="Parent">Parent</Option>
                <Option value="Friend">Friend</Option>
                <Option value="Relative">Relative</Option>
                <Option value="Brother">Brother</Option>
                <Option value="Sister">Sister</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Step4EmergencyContacts;