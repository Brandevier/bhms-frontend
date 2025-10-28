import React from "react";
import { Modal, Form, Input, Select, DatePicker, Button, Row, Col, Typography } from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { Title } = Typography;

const PatientEditModal = ({ visible, onCancel, onSubmit, loading, form, patient }) => {
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>Update Patient Information</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={onSubmit}
        >
          Update Information
        </Button>,
      ]}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Title level={5} style={{ marginBottom: 16 }}>Personal Details</Title>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="First Name"
              name="first_name"
              rules={[{ required: true, message: 'First name is required' }]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Middle Name"
              name="middle_name"
            >
              <Input placeholder="Enter middle name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[{ required: true, message: 'Last name is required' }]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: 'Gender is required' }]}
            >
              <Select placeholder="Select gender">
                <Option value="M">Male</Option>
                <Option value="F">Female</Option>
                <Option value="O">Other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Date of Birth"
              name="date_of_birth"
            >
              <DatePicker style={{ width: '100%' }} placeholder="Select date" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[{ required: true, message: 'Phone number is required' }]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
            >
              <Input type="email" placeholder="Enter email address" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Folder Number"
              name="folder_number"
            >
              <Input placeholder="Enter folder number" />
            </Form.Item>
          </Col>
        </Row>

        <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>Emergency Contacts</Title>
        
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Emergency Contact Name"
              name={['metadata', 'relatives', 'emergency_contact', 'name']}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Emergency Contact Phone"
              name={['metadata', 'relatives', 'emergency_contact', 'phone']}
            >
              <Input placeholder="Enter phone" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Relationship"
              name={['metadata', 'relatives', 'emergency_contact', 'relationship']}
            >
              <Input placeholder="Enter relationship" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Next of Kin Name"
              name={['metadata', 'relatives', 'next_of_kin', 'name']}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Next of Kin Phone"
              name={['metadata', 'relatives', 'next_of_kin', 'phone']}
            >
              <Input placeholder="Enter phone" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Relationship"
              name={['metadata', 'relatives', 'next_of_kin', 'relationship']}
            >
              <Input placeholder="Enter relationship" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PatientEditModal;