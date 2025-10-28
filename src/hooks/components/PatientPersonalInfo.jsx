import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

const PatientPersonalInfo = ({ patient }) => {
  const formatDate = (date) => date ? dayjs(date).format("MMM D, YYYY") : "Not Provided";
  const calculateAge = (dob) => dob ? dayjs().diff(dayjs(dob), 'year') : "N/A";

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Personal Information
        </div>
      }
      bordered={false}
      style={{ 
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: 16
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <InfoItem 
            label="Full Name"
            value={`${patient?.first_name || ''} ${patient?.middle_name || ''} ${patient?.last_name || ''}`.trim()}
            icon={<UserOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <InfoItem 
            label="Gender"
            value={patient?.gender === 'M' ? 'Male' : patient?.gender === 'F' ? 'Female' : 'Other'}
            icon={<UserOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <InfoItem 
            label="Date of Birth"
            value={formatDate(patient?.date_of_birth)}
            icon={<CalendarOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <InfoItem 
            label="Age"
            value={`${calculateAge(patient?.date_of_birth)} years`}
            icon={<UserOutlined />}
          />
        </Col>
      </Row>
    </Card>
  );
};

const InfoItem = ({ label, value, icon }) => (
  <div style={{ textAlign: 'center', padding: '8px' }}>
    <div style={{ 
      width: 40, 
      height: 40, 
      borderRadius: '50%', 
      background: '#e6f7ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 8px',
      color: '#1890ff'
    }}>
      {icon}
    </div>
    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
      {label}
    </Text>
    <Text strong style={{ display: 'block', marginTop: 4 }}>
      {value || 'N/A'}
    </Text>
  </div>
);

export default PatientPersonalInfo;