import React, { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, Row, Col, Typography, Checkbox } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const Step3Insurance = ({ form, initialValues }) => {
  const [hasInsurance, setHasInsurance] = useState(false);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.setFieldsValue(initialValues);
      setHasInsurance(initialValues.has_insurance || false);
    }
  }, [form, initialValues]);

  return (
    <div className="space-y-6">
      <div>
        <Title level={4} className="!mb-2">Insurance Information</Title>
        <Text type="secondary">Does the patient have insurance coverage?</Text>
      </div>

      <Form.Item name="has_insurance" valuePropName="checked">
        <Checkbox 
          checked={hasInsurance}
          onChange={(e) => setHasInsurance(e.target.checked)}
          className="text-lg"
        >
          Patient has insurance coverage
        </Checkbox>
      </Form.Item>

      {hasInsurance && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item 
                label="NHIS Number" 
                name="nhis_number" 
                rules={[{ required: true, message: "NHIS number is required" }]}
              >
                <Input placeholder="Enter NHIS number" size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                label="Insurance Provider" 
                name="insurance_provider"
                rules={[{ required: true, message: "Insurance provider is required" }]}
              >
                <Select placeholder="Select insurance provider" size="large">
                  <Option value="NHIS">NHIS</Option>
                  <Option value="PRIVATE">Private</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                label="Insurance Expiry Date" 
                name="insurance_expiry_date"
                rules={[{ required: true, message: "Insurance expiry date is required" }]}
              >
                <DatePicker 
                  style={{ width: "100%" }} 
                  size="large" 
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Step3Insurance;