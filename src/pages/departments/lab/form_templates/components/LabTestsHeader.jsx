import React from 'react';
import { Card, Descriptions, Tag, Typography,Space } from 'antd';
import { UserOutlined, IdcardOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const LabTestsHeader = ({ visitData }) => {
  if (!visitData) return null;

  const { patient, attendance_number, visit_date, visit_type } = visitData;
  const patientName = `${patient?.first_name} ${patient?.middle_name || ''} ${patient?.last_name}`;

  return (
    <Card style={{ marginBottom: 24 }}>
      <Descriptions
        title={
          <Space>
            <UserOutlined />
            Patient Information
          </Space>
        }
        bordered
        column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Patient Name">
          <Text strong>{patientName}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Folder Number">
          <Tag color="blue">{patient?.folder_number}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Attendance Number">
          <Tag icon={<IdcardOutlined />}>{attendance_number}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Visit Date">
          <Tag icon={<CalendarOutlined />}>
            {new Date(visit_date).toLocaleDateString()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Visit Type">
          <Tag color="purple">{visit_type}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Gender/Age">
          {patient?.gender} / {calculateAge(patient?.date_of_birth)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'Unknown';
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export default LabTestsHeader;