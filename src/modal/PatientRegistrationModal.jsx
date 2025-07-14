import React, { useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Row, Col, Spin, Checkbox } from "antd";
import PhoneInput from "react-phone-input-2";
import BhmsButton from "../heroComponents/BhmsButton";
const { Option } = Select;

const PatientRegistrationModal = ({ visible, onClose, onSubmit, status }) => {
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [nextOfKinPhone, setNextOfKinPhone] = useState("");

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.phone_number = phone;
      values.next_of_kin_phone = nextOfKinPhone;
      values.emergency_contact_phone = emergencyPhone;
      
      // Check if onSubmit exists and is a function
      if (typeof onSubmit === 'function') {
        await onSubmit(values);
        form.resetFields();
        setPhone("");
        setEmergencyPhone("");
        setNextOfKinPhone("");
      } else {
        console.error("onSubmit is not a function");
      }
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  return (
    <Modal
      title="Register New Patient"
      width={800}
      open={visible}
      onCancel={onClose}
      footer={[
        <BhmsButton block={false} outline={true} size="medium" key="cancel" onClick={onClose}>
          Cancel
        </BhmsButton>,
        <BhmsButton key="submit" block={false} size="medium" onClick={handleSubmit}>
          {status.createPatient == 'loading' ? <Spin /> : 'Register'}
        </BhmsButton>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="First Name" name="first_name" rules={[{ required: true, message: "First name is required" }]}>
              <Input placeholder="Enter first name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Middle Name" name="middle_name">
              <Input placeholder="Enter middle name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Last Name" name="last_name" rules={[{ required: true, message: "Last name is required" }]}>
              <Input placeholder="Enter last name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Select gender" }]}>
              <Select placeholder="Select gender">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Date of Birth" name="date_of_birth" rules={[{ required: true, message: "Select date of birth" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Phone Number" name="phone_number" rules={[{ required: true, message: "Phone number is required" }]}>
              <PhoneInput
                country={"gh"}
                value={phone}
                onChange={setPhone}
                inputStyle={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="NIN Number" name="nin_number">
              <Input placeholder="Enter NIN number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="NHIS Number" name="nhis_number">
              <Input placeholder="Enter NHIS number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Ghana Card Number" name="ghana_card_number">
              <Input placeholder="Enter Ghana card number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="City" name="city" rules={[{ required: true, message: "City is required" }]}>
              <Input placeholder="Enter city" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Country" name="country" rules={[{ required: true, message: "Select country" }]}>
              <Select placeholder="Select country">
                <Option value="Ghana">Ghana</Option>
                <Option value="Nigeria">Nigeria</Option>
                {/* Add more countries as needed */}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Religion" name="religion">
              <Select placeholder="Select religion">
                <Option value="Christianity">Christianity</Option>
                <Option value="Islam">Islam</Option>
                <Option value="Traditional">Traditional</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Address" name="address" rules={[{ required: true, message: "Address is required" }]}>
              <Input.TextArea rows={2} placeholder="Enter address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Email" name="email" rules={[{ type: "email", message: "Enter a valid email" }]}>
              <Input placeholder="Enter email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="is_antenatal_patient" valuePropName="checked">
              <Checkbox>Is Antenatal Patient</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        {/* Next of Kin Information */}
        <h3>Next of Kin Information</h3>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Name" name="next_of_kin_name">
              <Input placeholder="Enter next of kin name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Phone" name="next_of_kin_phone">
              <PhoneInput
                country={"gh"}
                value={nextOfKinPhone}
                onChange={setNextOfKinPhone}
                inputStyle={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Relationship" name="next_of_kin_relationship">
              <Input placeholder="Enter relationship" />
            </Form.Item>
          </Col>
        </Row>

        {/* Emergency Contact Information */}
        <h3>Emergency Contact Information</h3>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Name" name="emergency_contact_name">
              <Input placeholder="Enter emergency contact name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Phone" name="emergency_contact_phone">
              <PhoneInput
                country={"gh"}
                value={emergencyPhone}
                onChange={setEmergencyPhone}
                inputStyle={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Relationship" name="emergency_contact_relationship">
              <Input placeholder="Enter relationship" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PatientRegistrationModal;