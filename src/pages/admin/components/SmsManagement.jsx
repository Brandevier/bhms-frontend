import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Input, Button, message, Typography, Divider, Spin } from 'antd';
import { UserOutlined, TeamOutlined, MailOutlined, LoadingOutlined } from '@ant-design/icons';
import BhmsButton from '../../../heroComponents/BhmsButton';
import { getDepartment } from '../../../redux/slice/departmentSlice';



const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const SmsManagement = () => {
  const [form] = Form.useForm();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);
  const [selectedRecipientType, setSelectedRecipientType] = useState('staff');

  // Sample data - replace with actual API calls
  const [staffs, setStaffs] = useState([
    { id: 1, name: 'Dr. John Doe' },
    { id: 2, name: 'Nurse Jane Smith' }
  ]);
  
  const [patients, setPatients] = useState([
    { id: 1, name: 'Patient Michael Brown' },
    { id: 2, name: 'Patient Sarah Johnson' }
  ]);
  
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Cardiology' },
    { id: 2, name: 'Pediatrics' }
  ]);

  // Check internet connection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRecipientTypeChange = (value) => {
    setSelectedRecipientType(value);
    form.setFieldsValue({ recipients: [] }); // Clear selected recipients when type changes
  };

  const handleSendSms = async () => {
    if (!isOnline) {
      message.error('You are not connected to the internet');
      return;
    }

    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success(`SMS sent successfully to ${values.recipients.length} recipients`);
      form.resetFields();
    } catch (error) {
      console.error('Error sending SMS:', error);
      message.error('Failed to send SMS');
    } finally {
      setLoading(false);
    }
  };

  const renderRecipientOptions = () => {
    switch (selectedRecipientType) {
      case 'staff':
        return staffs.map(staff => (
          <Option key={staff.id} value={staff.id}>
            <UserOutlined /> {staff.name}
          </Option>
        ));
      case 'patient':
        return patients.map(patient => (
          <Option key={patient.id} value={patient.id}>
            <UserOutlined /> {patient.name}
          </Option>
        ));
      case 'department':
        return departments.map(dept => (
          <Option key={dept.id} value={dept.id}>
            <TeamOutlined /> {dept.name}
          </Option>
        ));
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={4} style={{ marginBottom: '24px' }}>
          <MailOutlined /> SMS Management
        </Title>
        
        <Divider orientation="left">Compose Message</Divider>
        
        <Form
          form={form}
          layout="vertical"
          initialValues={{ recipientType: 'staff' }}
        >
          <Form.Item
            label="Recipient Type"
            name="recipientType"
            rules={[{ required: true, message: 'Please select recipient type' }]}
          >
            <Select onChange={handleRecipientTypeChange}>
              <Option value="staff">
                <UserOutlined /> Staff Members
              </Option>
              <Option value="patient">
                <UserOutlined /> Patients
              </Option>
              <Option value="department">
                <TeamOutlined /> Departments
              </Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label={`Select ${selectedRecipientType === 'staff' ? 'Staff' : selectedRecipientType === 'patient' ? 'Patients' : 'Departments'}`}
            name="recipients"
            rules={[{ required: true, message: 'Please select at least one recipient' }]}
          >
            <Select
              mode="multiple"
              placeholder={`Select ${selectedRecipientType}s`}
              style={{ width: '100%' }}
            >
              {renderRecipientOptions()}
            </Select>
          </Form.Item>
          
          <Form.Item
            label="Message"
            name="message"
            rules={[
              { required: true, message: 'Please enter your message' },
              { max: 160, message: 'Message must be 160 characters or less' }
            ]}
          >
            <TextArea
              rows={5}
              placeholder="Type your message here (max 160 characters)..."
              showCount
              maxLength={160}
            />
          </Form.Item>
          
          <Form.Item>
            <BhmsButton
              block={false}
              size='medium'
              onClick={handleSendSms}
              icon={loading ? <LoadingOutlined /> : <MailOutlined />}
              disabled={!isOnline}
              loading={loading}
            >
              Send SMS
            </BhmsButton>
            
            {!isOnline && (
              <Text type="danger" style={{ marginLeft: '16px' }}>
                <small>You are offline. Please connect to the internet to send messages.</small>
              </Text>
            )}
          </Form.Item>
        </Form>
      </Card>
      
      <Card style={{ marginTop: '24px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>
          SMS History
        </Title>
        <Text type="secondary">Recent sent messages will appear here</Text>
        {/* You would implement an actual table here for history */}
      </Card>
    </div>
  );
};

export default SmsManagement;