import React from 'react';
import { Card, Row, Col, Typography, Tag, Button, Space, Badge } from 'antd';
import { 
  UserOutlined, 
  MedicineBoxOutlined, 
  CalendarOutlined,
  DownOutlined,
  UpOutlined,
  PhoneOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Text, Title } = Typography;

const PatientSummaryCard = ({ patientData, isExpanded, onToggleExpand }) => {
  const { patient, prescriptions } = patientData;
  
  const dispensedCount = prescriptions.filter(p => p.is_dispensed).length;
  const pendingCount = prescriptions.filter(p => !p.is_dispensed).length;
  const lastDispensed = prescriptions
    .filter(p => p.is_dispensed)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

  return (
    <Card 
      className="border-0 shadow-none bg-transparent"
      bodyStyle={{ padding: 0 }}
    >
      <Row gutter={[16, 16]} align="middle">
        {/* Patient Avatar and Basic Info */}
        <Col xs={24} md={6}>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UserOutlined className="text-blue-600 text-xl" />
              </div>
              <Badge 
                count={prescriptions.length} 
                size="small"
                className="absolute -top-1 -right-1"
              />
            </div>
            <div>
              <Title level={5} className="!mb-1">
                {patient?.first_name} {patient?.last_name}
              </Title>
              <Text type="secondary" className="flex items-center text-sm">
                <IdcardOutlined className="mr-1" />
                ID: {patient?.folder_number || 'N/A'}
              </Text>
            </div>
          </div>
        </Col>

        {/* Contact Information */}
        <Col xs={24} md={4}>
          <div className="space-y-1">
            <Text className="flex items-center text-sm">
              <PhoneOutlined className="mr-2 text-gray-400" />
              {patient?.phone_number || 'No phone'}
            </Text>
            <Text type="secondary" className="text-xs">
              {patient?.age ? `${patient.age} years` : 'Age not specified'}
            </Text>
          </div>
        </Col>

        {/* Prescription Stats */}
        <Col xs={24} md={6}>
          <div className="flex space-x-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{prescriptions.length}</div>
              <Text type="secondary" className="text-xs">Total Rx</Text>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{dispensedCount}</div>
              <Text type="secondary" className="text-xs">Dispensed</Text>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500">{pendingCount}</div>
              <Text type="secondary" className="text-xs">Pending</Text>
            </div>
          </div>
        </Col>

        {/* Last Activity */}
        <Col xs={24} md={4}>
          <div className="space-y-1">
            <Text className="flex items-center text-sm">
              <CalendarOutlined className="mr-2 text-gray-400" />
              Last Dispensed
            </Text>
            <Text strong className="text-sm">
              {lastDispensed ? moment(lastDispensed.updatedAt).format('DD MMM YYYY') : 'Never'}
            </Text>
          </div>
        </Col>

        {/* Emergency Indicator */}
        <Col xs={24} md={2}>
          {prescriptions.some(p => p.is_emergency) && (
            <Tag color="red" className="w-full text-center">
              EMERGENCY
            </Tag>
          )}
        </Col>

        {/* Expand Button */}
        <Col xs={24} md={2}>
          <div className="flex justify-end">
            <Button
              type="primary"
              ghost
              icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
              onClick={onToggleExpand}
              className="flex items-center"
            >
              {isExpanded ? 'Less' : 'Details'}
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default PatientSummaryCard;