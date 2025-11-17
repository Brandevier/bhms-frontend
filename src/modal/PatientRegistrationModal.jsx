import React, { useState } from "react";
import { 
  Steps, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Row, 
  Col, 
  Spin, 
  Checkbox, 
  Card,
  Divider,
  Typography,
  Space,
  Modal
} from "antd";
import { 
  UserOutlined, 
  IdcardOutlined, 
  ContactsOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined 
} from "@ant-design/icons";
import PhoneInput from "react-phone-input-2";
import BhmsButton from "../heroComponents/BhmsButton";

const { Option } = Select;
const { Title, Text } = Typography;
const { Step } = Steps;

const PatientRegistrationStepper = ({ visible, onClose, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [nextOfKinPhone, setNextOfKinPhone] = useState("");
  const [hasInsurance, setHasInsurance] = useState(false);

  const steps = [
    {
      title: "Personal Info",
      icon: <UserOutlined />,
    },
    {
      title: "Contact Details",
      icon: <ContactsOutlined />,
    },
    {
      title: "Insurance",
      icon: <SafetyCertificateOutlined />,
    },
    {
      title: "Emergency Contacts",
      icon: <IdcardOutlined />,
    },
    {
      title: "Review",
      icon: <CheckCircleOutlined />,
    },
  ];

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.phone_number = phone;
      values.next_of_kin_phone = nextOfKinPhone;
      values.emergency_contact_phone = emergencyPhone;
      values.has_insurance = hasInsurance;
      
      if (typeof onSubmit === 'function') {
        await onSubmit(values);
        // Reset form on success if needed
        // form.resetFields();
        // setPhone("");
        // setEmergencyPhone("");
        // setNextOfKinPhone("");
        // setHasInsurance(false);
        // setCurrentStep(0);
      }
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  const Step1PersonalInfo = () => (
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
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            label="Date of Birth" 
            name="date_of_birth" 
            rules={[{ required: true, message: "Select date of birth" }]}
          >
            <DatePicker style={{ width: "100%" }} size="large" />
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

  const Step2ContactDetails = () => (
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
            <PhoneInput
              country={"gh"}
              value={phone}
              onChange={setPhone}
              inputStyle={{ 
                width: "100%", 
                height: "40px",
                fontSize: "16px"
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            label="Email" 
            name="email" 
            rules={[{ type: "email", message: "Enter a valid email" }]}
          >
            <Input placeholder="Enter email" size="large" />
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

  const Step3Insurance = () => (
    <div className="space-y-6">
      <div>
        <Title level={4} className="!mb-2">Insurance Information</Title>
        <Text type="secondary">Does the patient have insurance coverage?</Text>
      </div>

      <Form.Item name="has_insurance" valuePropName="checked">
        <Checkbox 
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
              <Form.Item label="Insurance Provider" name="insurance_provider">
                <Select placeholder="Select insurance provider" size="large">
                  <Option value="NHIS">NHIS</Option>
                  <Option value="Private">Private</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Insurance Expiry Date" name="insurance_expiry_date">
                <DatePicker style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );

  const Step4EmergencyContacts = () => (
    <div className="space-y-8">
      <div>
        <Title level={4} className="!mb-2">Emergency Contacts</Title>
        <Text type="secondary">Who should we contact in case of emergency?</Text>
      </div>

      <Card title="Next of Kin" className="shadow-sm">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Name" name="next_of_kin_name">
              <Input placeholder="Enter full name" size="large" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Phone" name="next_of_kin_phone">
              <PhoneInput
                country={"gh"}
                value={nextOfKinPhone}
                onChange={setNextOfKinPhone}
                inputStyle={{ 
                  width: "100%", 
                  height: "40px",
                  fontSize: "16px"
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Relationship" name="next_of_kin_relationship">
              <Select placeholder="Select relationship" size="large">
                <Option value="Spouse">Spouse</Option>
                <Option value="Parent">Parent</Option>
                <Option value="Child">Child</Option>
                <Option value="Sibling">Sibling</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Emergency Contact" className="shadow-sm">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Name" name="emergency_contact_name">
              <Input placeholder="Enter full name" size="large" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Phone" name="emergency_contact_phone">
              <PhoneInput
                country={"gh"}
                value={emergencyPhone}
                onChange={setEmergencyPhone}
                inputStyle={{ 
                  width: "100%", 
                  height: "40px",
                  fontSize: "16px"
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Relationship" name="emergency_contact_relationship">
              <Select placeholder="Select relationship" size="large">
                <Option value="Spouse">Spouse</Option>
                <Option value="Parent">Parent</Option>
                <Option value="Friend">Friend</Option>
                <Option value="Relative">Relative</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </div>
  );

  const Step5Review = () => {
    const values = form.getFieldsValue();
    
    const ReviewSection = ({ title, children }) => (
      <div className="mb-6">
        <Title level={5} className="!mb-3">{title}</Title>
        <Card className="bg-gray-50 border-0">
          {children}
        </Card>
      </div>
    );

    const ReviewItem = ({ label, value }) => (
      <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
        <Text strong>{label}:</Text>
        <Text>{value || "Not provided"}</Text>
      </div>
    );

    return (
      <div className="space-y-6">
        <div>
          <Title level={4} className="!mb-2">Review Information</Title>
          <Text type="secondary">Please review all information before submitting</Text>
        </div>

        <ReviewSection title="Personal Information">
          <ReviewItem label="Full Name" value={`${values.first_name} ${values.middle_name || ''} ${values.last_name}`.trim()} />
          <ReviewItem label="Gender" value={values.gender === 'M' ? 'Male' : 'Female'} />
          <ReviewItem label="Date of Birth" value={values.date_of_birth?.format('MMMM DD, YYYY')} />
          <ReviewItem label="Religion" value={values.religion} />
        </ReviewSection>

        <ReviewSection title="Contact Information">
          <ReviewItem label="Phone" value={phone} />
          <ReviewItem label="Email" value={values.email} />
          <ReviewItem label="Address" value={values.address} />
          <ReviewItem label="City" value={values.city} />
          <ReviewItem label="Country" value={values.country} />
        </ReviewSection>

        <ReviewSection title="Insurance Information">
          <ReviewItem 
            label="Insurance Status" 
            value={hasInsurance ? "Yes" : "No"} 
          />
          {hasInsurance && (
            <>
              <ReviewItem label="NHIS Number" value={values.nhis_number} />
              <ReviewItem label="Insurance Provider" value={values.insurance_provider} />
              <ReviewItem label="Expiry Date" value={values.insurance_expiry_date?.format('MMMM DD, YYYY')} />
            </>
          )}
        </ReviewSection>

        <ReviewSection title="Emergency Contacts">
          <ReviewItem label="Next of Kin" value={values.next_of_kin_name} />
          <ReviewItem label="Next of Kin Phone" value={nextOfKinPhone} />
          <ReviewItem label="Relationship" value={values.next_of_kin_relationship} />
          <ReviewItem label="Emergency Contact" value={values.emergency_contact_name} />
          <ReviewItem label="Emergency Phone" value={emergencyPhone} />
          <ReviewItem label="Relationship" value={values.emergency_contact_relationship} />
        </ReviewSection>
      </div>
    );
  };

  const stepContent = [
    <Step1PersonalInfo key="1" />,
    <Step2ContactDetails key="2" />,
    <Step3Insurance key="3" />,
    <Step4EmergencyContacts key="4" />,
    <Step5Review key="5" />,
  ];

  return (
    <Modal
      title={
        <div>
          <Title level={3} className="!mb-2">Register New Patient</Title>
          <Text type="secondary">Complete all steps to register a new patient</Text>
        </div>
      }
      width={900}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="my-6">
        <Steps current={currentStep} size="small">
          {steps.map((step, index) => (
            <Step key={index} title={step.title} icon={step.icon} />
          ))}
        </Steps>
      </div>

      <Divider />

      <Form
        layout="vertical"
        form={form}
        className="my-6"
      >
        {stepContent[currentStep]}
      </Form>

      <Divider />

      <div className="flex justify-between">
        <Space>
          {currentStep > 0 && (
            <BhmsButton 
              block={false} 
              outline={true} 
              size="medium" 
              onClick={prev}
            >
              Previous
            </BhmsButton>
          )}
          <BhmsButton 
            block={false} 
            outline={true} 
            size="medium" 
            onClick={onClose}
          >
            Cancel
          </BhmsButton>
        </Space>

        <Space>
          {currentStep < steps.length - 1 && (
            <BhmsButton 
              block={false} 
              size="medium" 
              onClick={next}
            >
              Next
            </BhmsButton>
          )}
          {currentStep === steps.length - 1 && (
            <BhmsButton 
              block={false} 
              size="medium" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <Spin /> : 'Complete Registration'}
            </BhmsButton>
          )}
        </Space>
      </div>
    </Modal>
  );
};

export default PatientRegistrationStepper;