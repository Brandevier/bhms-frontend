import React, { useState } from "react";
import { Steps, Form, Divider, Typography, Modal, Space } from "antd";
import { 
  UserOutlined, 
  IdcardOutlined, 
  ContactsOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined 
} from "@ant-design/icons";
import Step1PersonalInfo from "./components/Step1PersonalInfo";
import Step2ContactDetails from "./components/Step2ContactDetails";
import Step3Insurance from "./components/Step3Insurance";
import Step4EmergencyContacts from "./components/Step4EmergencyContacts";
import Step5Review from "./components/Step5Review"
import TonitelButton from "../../components/common/TonitelButton";



const { Title, Text } = Typography;
const { Step } = Steps;

const PatientRegistrationStepper = ({ visible, onClose, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {},
    contactDetails: {},
    insurance: {},
    emergencyContacts: {}
  });

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

  const updateFormData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  const next = async () => {
    try {
      // Validate current step before proceeding
      const fields = await form.validateFields();
      
      // Update form data with current step values
      switch(currentStep) {
        case 0:
          updateFormData('personalInfo', fields);
          break;
        case 1:
          updateFormData('contactDetails', fields);
          break;
        case 2:
          updateFormData('insurance', fields);
          break;
        case 3:
          updateFormData('emergencyContacts', fields);
          break;
        default:
          break;
      }
      
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Combine all form data
      const finalData = {
        ...formData.personalInfo,
        ...formData.contactDetails,
        ...formData.insurance,
        ...formData.emergencyContacts,
        ...values
      };
      
      if (typeof onSubmit === 'function') {
        await onSubmit(finalData);
      }
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  const stepContent = [
    <Step1PersonalInfo key="1" form={form} initialValues={formData.personalInfo} />,
    <Step2ContactDetails key="2" form={form} initialValues={formData.contactDetails} />,
    <Step3Insurance key="3" form={form} initialValues={formData.insurance} />,
    <Step4EmergencyContacts key="4" form={form} initialValues={formData.emergencyContacts} />,
    <Step5Review key="5" formData={formData} />,
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
      destroyOnClose
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
        preserve={false}
      >
        {stepContent[currentStep]}
      </Form>

      <Divider />

      <div className="flex justify-between">
        <Space>
          {currentStep > 0 && (
            <TonitelButton 
              block={false} 
              outline={true} 
              size="medium" 
              onClick={prev}
            >
              Previous
            </TonitelButton>
          )}
          <TonitelButton 
            block={false} 
            outline={true} 
            size="medium" 
            onClick={onClose}
          >
            Cancel
          </TonitelButton>
        </Space>

        <Space>
          {currentStep < steps.length - 1 && (
            <TonitelButton 
              block={false} 
              size="medium" 
              onClick={next}
            >
              Next
            </TonitelButton>
          )}
          {currentStep === steps.length - 1 && (
            <TonitelButton 
              block={false} 
              size="medium" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Complete Registration'}
            </TonitelButton>
          )}
        </Space>
      </div>
    </Modal>
  );
};

export default PatientRegistrationStepper;