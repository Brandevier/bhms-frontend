import React, { useState } from 'react';
import { Card, Tabs, Tag, Badge, Button, Space, Typography } from 'antd';
import { 
  UserOutlined, 
  EditOutlined,
} from '@ant-design/icons';
import EditPatientModal from './EditPatientModal';
import BasicInfoTab from './BasicInfoTab';
import ContactInfoTab from './ContactInfoTab';
import AdditionalInfoTab from './AdditionalInfoTab';

const { Title, Text } = Typography;

const PatientInfoTabs = ({ patient, onPatientUpdate }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  const { 
    first_name, 
    middle_name, 
    last_name, 
    folder_number,
    status,
  } = patient;

  const handleEditClick = () => {
    setIsEditModalVisible(true);
  };

  const handleModalClose = () => {
    setIsEditModalVisible(false);
  };

  const handlePatientUpdate = (updatedPatient) => {
    onPatientUpdate?.(updatedPatient);
    setIsEditModalVisible(false);
  };

  const fullName = `${first_name} ${middle_name || ''} ${last_name}`.trim();

  const tabItems = [
    {
      key: '1',
      label: 'Basic Info',
      children: <BasicInfoTab patient={patient} />,
    },
    {
      key: '2',
      label: 'Contact & Emergency',
      children: <ContactInfoTab patient={patient} />,
    },
    {
      key: '3',
      label: 'Additional Info',
      children: <AdditionalInfoTab patient={patient} />,
    },
  ];

  return (
    <>
      <Card 
        className="shadow-lg border-0 rounded-lg"
        bodyStyle={{ padding: 0 }}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <UserOutlined className="text-2xl text-blue-600" />
              </div>
              <div>
                <Title level={4} className="mb-1 !text-gray-900">
                  {fullName}
                </Title>
                <Space>
                  <Tag color="geekblue" className="font-mono">
                    {folder_number}
                  </Tag>
                  <Badge 
                    status={status === 'active' ? 'success' : 'error'} 
                    text={
                      <Text className="capitalize">
                        {status}
                      </Text>
                    } 
                  />
                </Space>
              </div>
            </div>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={handleEditClick}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 shadow-sm"
            >
              Edit Information
            </Button>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs 
          activeKey={activeTab}
          onChange={setActiveTab}
          className="px-6"
          items={tabItems}
        />
      </Card>

      <EditPatientModal
        visible={isEditModalVisible}
        patient={patient}
        onClose={handleModalClose}
        onUpdate={handlePatientUpdate}
      />
    </>
  );
};

export default PatientInfoTabs;