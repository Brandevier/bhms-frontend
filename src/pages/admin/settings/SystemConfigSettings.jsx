import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  message,
  Tabs,
  InputNumber,
  Alert,
  List,
  Tag,
  Checkbox
} from 'antd';
import {
  SettingOutlined,
  SaveOutlined,
  GlobalOutlined,
  MailOutlined,
  SecurityScanOutlined,
  BellOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  LockOutlined,
  SyncOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const SystemConfigSettings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const user = useSelector((state) => state.auth.admin || state.auth.user);

  // Form states
  const [generalForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [notificationForm] = Form.useForm();

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    institutionName: 'My Hospital',
    timezone: 'Africa/Accra',
    language: 'en',
    dateFormat: 'YYYY-MM-DD',
    currency: 'GHS',
    enableMaintenanceMode: false
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUser: 'noreply@hospital.com',
    smtpPassword: '',
    enableEmailNotifications: true,
    fromName: 'Hospital Management System',
    fromEmail: 'noreply@hospital.com'
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireSpecialChar: true,
    requireNumber: true,
    requireUppercase: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enable2FA: false,
    enforcePasswordChange: 90
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enablePushNotifications: true,
    notifyNewPatient: true,
    notifyAppointment: true,
    notifyLabResults: true,
    notifyPrescription: true,
    notifyPayment: true
  });

  const handleSaveGeneral = async (values) => {
    setLoading(true);
    try {
      // API call would go here
      console.log('Saving general settings:', values);
      setGeneralSettings(values);
      message.success('General settings saved successfully!');
    } catch (error) {
      message.error('Failed to save general settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async (values) => {
    setLoading(true);
    try {
      console.log('Saving email settings:', values);
      setEmailSettings(values);
      message.success('Email settings saved successfully!');
    } catch (error) {
      message.error('Failed to save email settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecurity = async (values) => {
    setLoading(true);
    try {
      console.log('Saving security settings:', values);
      setSecuritySettings(values);
      message.success('Security settings saved successfully!');
    } catch (error) {
      message.error('Failed to save security settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async (values) => {
    setLoading(true);
    try {
      console.log('Saving notification settings:', values);
      setNotificationSettings(values);
      message.success('Notification settings saved successfully!');
    } catch (error) {
      message.error('Failed to save notification settings');
    } finally {
      setLoading(false);
    }
  };

  const testEmailConnection = () => {
    message.info('Testing email connection...');
    // API call would go here
    setTimeout(() => {
      message.success('Email connection successful!');
    }, 1500);
  };

  const testDatabaseConnection = () => {
    message.info('Testing database connection...');
    // API call would go here
    setTimeout(() => {
      message.success('Database connection successful!');
    }, 1500);
  };

  const tabItems = [
    {
      key: 'general',
      label: (
        <span>
          <GlobalOutlined />
          General
        </span>
      ),
      children: (
        <Card className="border-0 shadow-sm">
          <Title level={4}>General Settings</Title>
          <Paragraph type="secondary">
            Configure basic system settings for your hospital management system.
          </Paragraph>
          <Divider />

          <Form
            form={generalForm}
            layout="vertical"
            initialValues={generalSettings}
            onFinish={handleSaveGeneral}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Institution Name"
                  name="institutionName"
                  rules={[{ required: true, message: 'Please enter institution name' }]}
                >
                  <Input placeholder="Enter institution name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Timezone"
                  name="timezone"
                  rules={[{ required: true, message: 'Please select timezone' }]}
                >
                  <Select placeholder="Select timezone">
                    <Option value="Africa/Accra">Africa/Accra (GMT)</Option>
                    <Option value="Africa/Lagos">Africa/Lagos</Option>
                    <Option value="Africa/Nairobi">Africa/Nairobi</Option>
                    <Option value="UTC">UTC</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Default Language"
                  name="language"
                >
                  <Select placeholder="Select language">
                    <Option value="en">English</Option>
                    <Option value="fr">French</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Date Format"
                  name="dateFormat"
                >
                  <Select placeholder="Select date format">
                    <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                    <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                    <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Currency"
                  name="currency"
                >
                  <Select placeholder="Select currency">
                    <Option value="GHS">Ghana Cedis (GHS)</Option>
                    <Option value="USD">US Dollar (USD)</Option>
                    <Option value="EUR">Euro (EUR)</Option>
                    <Option value="GBP">British Pound (GBP)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Maintenance Mode"
                  name="enableMaintenanceMode"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="ON" unCheckedChildren="OFF" />
                  <Text type="secondary" className="ml-2">
                    Enable to prevent user access during maintenance
                  </Text>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Save General Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      key: 'email',
      label: (
        <span>
          <MailOutlined />
          Email
        </span>
      ),
      children: (
        <Card className="border-0 shadow-sm">
          <Title level={4}>Email Configuration</Title>
          <Paragraph type="secondary">
            Configure SMTP settings for sending emails from the system.
          </Paragraph>
          <Divider />

          <Alert
            message="SMTP Configuration"
            description="Enter your SMTP server details to enable email notifications."
            type="info"
            showIcon
            className="mb-4"
          />

          <Form
            form={emailForm}
            layout="vertical"
            initialValues={emailSettings}
            onFinish={handleSaveEmail}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="SMTP Host"
                  name="smtpHost"
                  rules={[{ required: true, message: 'Please enter SMTP host' }]}
                >
                  <Input placeholder="smtp.example.com" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="SMTP Port"
                  name="smtpPort"
                  rules={[{ required: true, message: 'Please enter SMTP port' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="587" min={1} max={65535} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="SMTP Username"
                  name="smtpUser"
                  rules={[{ required: true, message: 'Please enter SMTP username' }]}
                >
                  <Input placeholder="username" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="SMTP Password"
                  name="smtpPassword"
                >
                  <Input.Password placeholder="Enter password" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="From Name"
                  name="fromName"
                  rules={[{ required: true, message: 'Please enter from name' }]}
                >
                  <Input placeholder="Hospital Name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="From Email"
                  name="fromEmail"
                  rules={[
                    { required: true, message: 'Please enter from email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input placeholder="noreply@hospital.com" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Enable Email Notifications"
                  name="enableEmailNotifications"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="ON" unCheckedChildren="OFF" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  Save Email Settings
                </Button>
                <Button
                  icon={<SyncOutlined />}
                  onClick={testEmailConnection}
                >
                  Test Connection
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      key: 'security',
      label: (
        <span>
          <SecurityScanOutlined />
          Security
        </span>
      ),
      children: (
        <Card className="border-0 shadow-sm">
          <Title level={4}>Security Settings</Title>
          <Paragraph type="secondary">
            Configure security policies and authentication settings.
          </Paragraph>
          <Divider />

          <Form
            form={securityForm}
            layout="vertical"
            initialValues={securitySettings}
            onFinish={handleSaveSecurity}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Session Timeout (minutes)"
                  name="sessionTimeout"
                >
                  <InputNumber style={{ width: '100%' }} min={5} max={120} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Minimum Password Length"
                  name="passwordMinLength"
                >
                  <InputNumber style={{ width: '100%' }} min={6} max={32} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Max Login Attempts"
                  name="maxLoginAttempts"
                >
                  <InputNumber style={{ width: '100%' }} min={3} max={10} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Account Lockout Duration (minutes)"
                  name="lockoutDuration"
                >
                  <InputNumber style={{ width: '100%' }} min={5} max={60} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Force Password Change (days)"
                  name="enforcePasswordChange"
                >
                  <InputNumber style={{ width: '100%' }} min={30} max={365} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Divider>Password Requirements</Divider>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="requireSpecialChar"
                  valuePropName="checked"
                >
                  <Checkbox>Require Special Character</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="requireNumber"
                  valuePropName="checked"
                >
                  <Checkbox>Require Number</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="requireUppercase"
                  valuePropName="checked"
                >
                  <Checkbox>Require Uppercase</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Enable Two-Factor Authentication"
                  name="enable2FA"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="ON" unCheckedChildren="OFF" />
                  <Text type="secondary" className="ml-2">
                    Require 2FA for all users
                  </Text>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Save Security Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      key: 'notifications',
      label: (
        <span>
          <BellOutlined />
          Notifications
        </span>
      ),
      children: (
        <Card className="border-0 shadow-sm">
          <Title level={4}>Notification Settings</Title>
          <Paragraph type="secondary">
            Configure how and when the system sends notifications.
          </Paragraph>
          <Divider />

          <Form
            form={notificationForm}
            layout="vertical"
            initialValues={notificationSettings}
            onFinish={handleSaveNotifications}
          >
            <Row gutter={24}>
              <Col xs={24}>
                <Divider>Notification Channels</Divider>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="enableEmailNotifications"
                  valuePropName="checked"
                >
                  <Switch checked={notificationSettings.enableEmailNotifications} /> Email Notifications
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="enableSMSNotifications"
                  valuePropName="checked"
                >
                  <Switch checked={notificationSettings.enableSMSNotifications} /> SMS Notifications
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="enablePushNotifications"
                  valuePropName="checked"
                >
                  <Switch checked={notificationSettings.enablePushNotifications} /> Push Notifications
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Divider>Notification Events</Divider>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="notifyNewPatient"
                  valuePropName="checked"
                >
                  <Checkbox>New Patient Registration</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="notifyAppointment"
                  valuePropName="checked"
                >
                  <Checkbox>Appointment Updates</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="notifyLabResults"
                  valuePropName="checked"
                >
                  <Checkbox>Lab Results Available</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="notifyPrescription"
                  valuePropName="checked"
                >
                  <Checkbox>New Prescriptions</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="notifyPayment"
                  valuePropName="checked"
                >
                  <Checkbox>Payment Received</Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Save Notification Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      key: 'database',
      label: (
        <span>
          <DatabaseOutlined />
          Database
        </span>
      ),
      children: (
        <Card className="border-0 shadow-sm">
          <Title level={4}>Database Configuration</Title>
          <Paragraph type="secondary">
            View and manage database connection settings.
          </Paragraph>
          <Divider />

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Card title="Database Status" size="small" className="mb-4">
                <List
                  size="small"
                  bordered={false}
                  dataSource={[
                    { label: 'Status', value: <Tag color="success">Connected</Tag> },
                    { label: 'Type', value: 'PostgreSQL' },
                    { label: 'Host', value: 'localhost:5432' },
                    { label: 'Database', value: 'hms_db' },
                    { label: 'Size', value: '245 MB' }
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text strong>{item.label}:</Text>
                      <span className="ml-2">{item.value}</span>
                    </List.Item>
                  )}
                />
                <Button
                  icon={<SyncOutlined />}
                  onClick={testDatabaseConnection}
                  className="mt-2"
                  block
                >
                  Test Connection
                </Button>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Database Statistics" size="small" className="mb-4">
                <List
                  size="small"
                  bordered={false}
                  dataSource={[
                    { label: 'Total Tables', value: '45' },
                    { label: 'Total Records', value: '125,432' },
                    { label: 'Last Backup', value: '2024-01-15 10:30 AM' },
                    { label: 'Next Scheduled Backup', value: '2024-01-16 02:00 AM' }
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text strong>{item.label}:</Text>
                      <span className="ml-2">{item.value}</span>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          <Alert
            message="Database Maintenance"
            description="Regular database maintenance is recommended for optimal performance. Consider running ANALYZE and VACUUM commands periodically."
            type="info"
            showIcon
            className="mt-4"
          />
        </Card>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Title level={2} className="text-gray-800 mb-2">
            <Space>
              <SettingOutlined className="text-blue-500" />
              System Configuration
            </Space>
          </Title>
          <Text type="secondary" className="text-lg">
            Configure system settings, security, email, and notifications
          </Text>
        </div>

        {/* Settings Tabs */}
        <Card className="border-0 shadow-sm">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            tabPosition="left"
          />
        </Card>
      </div>
    </div>
  );
};

export default SystemConfigSettings;

