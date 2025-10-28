import React from "react";
import { Card, Row, Col, Typography, Tag } from "antd";
import { HeartOutlined, TeamOutlined, PhoneOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const PatientEmergencyContacts = ({ patient }) => {
  const emergencyContact = patient?.metadata?.relatives?.emergency_contact;
  const nextOfKin = patient?.metadata?.relatives?.next_of_kin;

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TeamOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />
          Emergency Contacts
        </div>
      }
      bordered={false}
      style={{ 
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: 16
      }}
    >
      <Row gutter={[24, 16]}>
        <Col xs={24} lg={12}>
          <ContactCard 
            type="emergency"
            contact={emergencyContact}
            color="#ff4d4f"
            icon={<HeartOutlined />}
          />
        </Col>
        <Col xs={24} lg={12}>
          <ContactCard 
            type="nextOfKin"
            contact={nextOfKin}
            color="#fa8c16"
            icon={<TeamOutlined />}
          />
        </Col>
      </Row>
    </Card>
  );
};

const ContactCard = ({ type, contact, color, icon }) => {
  const title = type === 'emergency' ? 'Emergency Contact' : 'Next of Kin';
  
  return (
    <div style={{ 
      border: `1px solid ${color}20`,
      borderRadius: 8,
      padding: 16,
      background: `${color}05`,
      height: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ 
          width: 32, 
          height: 32, 
          borderRadius: '50%', 
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 8,
          color: color
        }}>
          {icon}
        </div>
        <Title level={5} style={{ margin: 0, color: color }}>
          {title}
        </Title>
      </div>

      <div style={{ marginBottom: 8 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>
          {contact?.name || 'Not Provided'}
        </Text>
        {contact?.relationship && (
          <Tag color={color} style={{ marginBottom: 8 }}>
            {contact.relationship}
          </Tag>
        )}
      </div>

      {contact?.phone && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PhoneOutlined style={{ marginRight: 8, color: '#666' }} />
          <Text>{contact.phone}</Text>
        </div>
      )}
    </div>
  );
};

export default PatientEmergencyContacts;