import React from 'react';
import { Card, Descriptions, Tag, Space } from 'antd';
import { 
  UserOutlined, 
  IdcardOutlined,
  CreditCardTwoTone as HospitalOutlined,
  CalendarOutlined 
} from '@ant-design/icons';

const PatientInfoCard = ({ invoice }) => {
  const patient = invoice.visit?.patient;
  const visit = invoice.visit;

  return (
    <Card 
      title={
        <Space>
          <UserOutlined />
          Patient Information
        </Space>
      }
      className="shadow-sm"
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label={
          <Space>
            <UserOutlined />
            Patient Name
          </Space>
        }>
          {patient?.name || 'N/A'}
        </Descriptions.Item>
        
        <Descriptions.Item label={
          <Space>
            <IdcardOutlined />
            Patient ID
          </Space>
        }>
          {patient?.folderNumber || 'N/A'}
        </Descriptions.Item>
        
        <Descriptions.Item label="Demographics">
          <Space>
            {patient?.age && <span>Age: {patient.age}</span>}
            {patient?.gender && <Tag>{patient.gender}</Tag>}
          </Space>
        </Descriptions.Item>
        
        <Descriptions.Item label={
          <Space>
            <HospitalOutlined />
            Visit Information
          </Space>
        }>
          <Space direction="vertical" size={0}>
            <div>Attendance #: {visit?.attendance_number}</div>
            <div>Department: {visit?.department?.name || 'N/A'}</div>
          </Space>
        </Descriptions.Item>
        
        <Descriptions.Item label={
          <Space>
            <HospitalOutlined />
            Institution
          </Space>
        }>
          {invoice.institution?.name || 'N/A'}
        </Descriptions.Item>
        
        {invoice.notes && (
          <Descriptions.Item label="Notes">
            {invoice.notes}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};

export default PatientInfoCard;