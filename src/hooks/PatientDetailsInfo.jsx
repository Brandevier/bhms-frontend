import React, { useState } from "react";
import { Card, Button, Typography, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Form } from "antd";
import dayjs from "dayjs";

// Import components
import PatientPersonalInfo from "./components/PatientPersonalInfo";
import PatientContactInfo from "./components/PatientContactInfo";
import PatientEmergencyContacts from "./components/PatientEmergencyContacts";
import PatientEditModal from "./components/PatientEditModal";

const { Title } = Typography;

const PatientDetailsInfo = ({ patient_record }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log('Updated values:', values);
      // API call would go here
      message.success('Patient information updated successfully');
      setVisible(false);
    } catch (error) {
      console.error('Error updating patient:', error);
      message.error('Failed to update patient information');
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    form.setFieldsValue({
      ...patient_record?.patient,
      date_of_birth: patient_record?.patient?.date_of_birth ? dayjs(patient_record?.patient?.date_of_birth) : null,
    });
    setVisible(true);
  };

  return (
    <>
      {/* Header Card with Edit Button */}
      <Card
        style={{ 
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3} style={{ color: 'white', margin: 0 }}>
              Patient Profile
            </Title>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              Complete patient information and emergency contacts
            </div>
          </div>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={showModal}
            style={{ 
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 6
            }}
          >
            Update Information
          </Button>
        </div>
      </Card>

      {/* Component Sections */}
      <PatientPersonalInfo patient={patient_record?.patient} />
      <PatientContactInfo patient={patient_record?.patient} />
      <PatientEmergencyContacts patient={patient_record?.patient} />

      {/* Edit Modal */}
      <PatientEditModal
        visible={visible}
        onCancel={() => setVisible(false)}
        onSubmit={handleSubmit}
        loading={loading}
        form={form}
        patient={patient_record?.patient}
      />
    </>
  );
};

export default PatientDetailsInfo;