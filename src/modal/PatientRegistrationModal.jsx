import React, { useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Row, Col, Spin } from "antd";
import PhoneInput from "react-phone-input-2";
import BhmsButton from "../heroComponents/BhmsButton";
const { Option } = Select;

const PatientRegistrationModal = ({ visible, onClose, onSubmit, status }) => {
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        values.phone_number = phone; // Add phone number to form values
        onSubmit(values); // Pass form data to parent component
        form.resetFields();
        setPhone(""); // Reset phone input
      })
      .catch((info) => console.log("Validation Failed:", info));
  };

  return (
    <Modal
      title="Register New Patient"
      width={700}
      open={visible}
      onCancel={onClose}
      footer={[
        <BhmsButton block={false} outline={true} size="medium" key="cancel" onClick={onClose}>
          Cancel
        </BhmsButton>,
        <BhmsButton key="submit" block={false} size="medium" onClick={handleSubmit}>
          {status == 'loading' ? <Spin /> : 'Register'}
        </BhmsButton>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="First Name" name="first_name" rules={[{ required: true, message: "First name is required" }]}>
              <Input placeholder="Enter first name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Middle Name" name="middle_name">
              <Input placeholder="Enter middle name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Last Name" name="last_name" rules={[{ required: true, message: "Last name is required" }]}>
              <Input placeholder="Enter last name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Select gender" }]}>
              <Select placeholder="Select gender">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Date of Birth" name="date_of_birth" rules={[{ required: true, message: "Select date of birth" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="NIN Number" name="nin_number">
              <Input placeholder="Enter NIN number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="City" name="city">
              <Input placeholder="Enter city" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Country" name="country" rules={[{ required: true, message: "Select country" }]}>
              <Select placeholder="Select country">
                <Option value="ghana">Ghana</Option>
                <Option value="nigeria">Nigeria</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Religion" name="religion">
              <Select placeholder="Select religion">
                <Option value="christianity">Christianity</Option>
                <Option value="islam">Islam</Option>
                <Option value="hinduism">Hinduism</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email" name="email" rules={[{ type: "email", message: "Enter a valid email" }]}>
              <Input placeholder="Enter email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Address" name="address">
              <Input.TextArea rows={2} placeholder="Enter address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Phone Number" name="phone_number" rules={[{ required: true, message: "Phone number is required" }]}>
              <PhoneInput
                country={"gh"} // Default country Ghana
                value={phone}
                onChange={(value) => setPhone(value)}
                inputStyle={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PatientRegistrationModal;
