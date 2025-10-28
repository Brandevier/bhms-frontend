import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { PhoneOutlined, MailOutlined, ContactsOutlined } from "@ant-design/icons";

const { Text } = Typography;

const PatientContactInfo = ({ patient }) => {
  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ContactsOutlined style={{ marginRight: 8, color: '#52c41a' }} />
          Contact Information
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
          <ContactItem 
            label="Phone Number"
            value={patient?.phone_number}
            icon={<PhoneOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <ContactItem 
            label="Email Address"
            value={patient?.email}
            icon={<MailOutlined />}
            color="#fa8c16"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <ContactItem 
            label="Folder Number"
            value={patient?.folder_number}
            icon={<ContactsOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>
    </Card>
  );
};

const ContactItem = ({ label, value, icon, color }) => (
  <div style={{ textAlign: 'center', padding: '8px' }}>
    <div style={{ 
      width: 40, 
      height: 40, 
      borderRadius: '50%', 
      background: `${color}15`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 8px',
      color: color
    }}>
      {icon}
    </div>
    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
      {label}
    </Text>
    <Text strong style={{ display: 'block', marginTop: 4, color: color }}>
      {value || 'N/A'}
    </Text>
  </div>
);

export default PatientContactInfo;