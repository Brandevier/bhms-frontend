import React from 'react';
import { Card, Form, Input, Select, InputNumber, Checkbox, Row, Col, Divider, Button, DatePicker } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const PreOpAssessmentCard = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Pre-op assessment:', values);
    // Handle assessment submission
  };

  return (
    <Card 
      title={
        <span>
          <FileTextOutlined className="mr-2" />
          Pre-Operative Assessment
        </span>
      } 
      className="mb-4 shadow-sm border"
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="skinAssessment" label="Skin Assessment">
              <Select placeholder="Select skin condition">
                <Option value="normal">Normal - Intact</Option>
                <Option value="dry">Dry Skin</Option>
                <Option value="abrasions">Abrasions</Option>
                <Option value="lesions">Lesions/Pressure Areas</Option>
                <Option value="edema">Edema Present</Option>
                <Option value="jaundice">Jaundice</Option>
                <Option value="cyanosis">Cyanosis</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="painScore" label="Pain Score (0-10)">
              <InputNumber 
                min={0} 
                max={10} 
                style={{ width: '100%' }}
                placeholder="0-10"
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item name="assessmentNotes" label="Assessment Notes">
          <TextArea 
            rows={3} 
            placeholder="Document comprehensive assessment findings, patient concerns, and observations..." 
          />
        </Form.Item>
        
        <Divider>Safety Verification</Divider>
        
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="idBand" valuePropName="checked">
              <Checkbox>ID Band Verified & Correct</Checkbox>
            </Form.Item>
            <Form.Item name="consent" valuePropName="checked">
              <Checkbox>Surgical Consent Verified</Checkbox>
            </Form.Item>
            <Form.Item name="allergyCheck" valuePropName="checked">
              <Checkbox>Allergy Status Confirmed</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="npo" valuePropName="checked">
              <Checkbox>NPO Status Confirmed</Checkbox>
            </Form.Item>
            <Form.Item name="jewelry" valuePropName="checked">
              <Checkbox>Jewelry/Metal Objects Removed</Checkbox>
            </Form.Item>
            <Form.Item name="prosthesis" valuePropName="checked">
              <Checkbox>Dentures/Prosthesis Removed</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        
        <Divider>Documentation</Divider>
        
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item 
              name="nurse" 
              label="Documenting Nurse"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="Enter nurse's name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item 
              name="date" 
              label="Date & Time"
              rules={[{ required: true, message: 'Please select date' }]}
            >
              <DatePicker 
                showTime 
                style={{ width: '100%' }} 
                format="MMM DD, YYYY HH:mm"
              />
            </Form.Item>
          </Col>
        </Row>
        
        <div className="flex justify-end">
          <Button type="primary" icon={<FileTextOutlined />} htmlType="submit">
            Sign & Save Assessment
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default PreOpAssessmentCard;