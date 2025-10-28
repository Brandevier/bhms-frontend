import React from 'react';
import { Card, Tag, Typography, Space, Divider, Row, Col, Badge } from 'antd';
import { 
  MedicineBoxOutlined, 
  UserOutlined, 
  CalendarOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Text, Title } = Typography;

const PrescriptionCard = ({ prescription }) => {
  const getStatusColor = (isDispensed, isEmergency) => {
    if (!isDispensed) return 'orange';
    if (isEmergency) return 'red';
    return 'green';
  };

  const getStatusText = (isDispensed, isEmergency) => {
    if (!isDispensed) return 'PENDING';
    if (isEmergency) return 'EMERGENCY DISPENSED';
    return 'DISPENSED';
  };

  return (
    <Card 
      size="small"
      className="h-full border hover:shadow-md transition-shadow"
      styles={{
        body: {
          padding: '16px'
        }
      }}
    >
      {/* Header with Medicine and Status */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <Title level={5} className="!mb-1 flex items-center">
            <MedicineBoxOutlined className="text-blue-500 mr-2" />
            {prescription.medicine?.generic_name}
          </Title>
          <Text type="secondary" className="text-sm">
            Code: {prescription.medicine?.code}
          </Text>
        </div>
        <Tag 
          color={getStatusColor(prescription.is_dispensed, prescription.is_emergency)}
          className="font-semibold"
        >
          {getStatusText(prescription.is_dispensed, prescription.is_emergency)}
        </Tag>
      </div>

      {/* Dosage Information */}
      <div className="mb-3">
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <div className="space-y-1">
              <Text type="secondary" className="text-xs">Dosage</Text>
              <div className="font-semibold">{prescription.dosage}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className="space-y-1">
              <Text type="secondary" className="text-xs">Quantity</Text>
              <div className="font-semibold">{prescription.quantity}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className="space-y-1">
              <Text type="secondary" className="text-xs">Frequency</Text>
              <div className="font-semibold">{prescription.frequency}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className="space-y-1">
              <Text type="secondary" className="text-xs">Duration</Text>
              <div className="font-semibold">{prescription.duration} days</div>
            </div>
          </Col>
        </Row>
      </div>

      <Divider className="my-3" />

      {/* Prescriber and Department */}
      <div className="mb-3">
        <Space direction="vertical" size="small" className="w-full">
          <div className="flex justify-between">
            <Text type="secondary" className="flex items-center text-xs">
              <UserOutlined className="mr-1" />
              Prescriber:
            </Text>
            <Text strong className="text-xs">
              Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text type="secondary" className="text-xs">Department:</Text>
            <Text strong className="text-xs">{prescription.department?.name}</Text>
          </div>
        </Space>
      </div>

      {/* Dates and Pricing */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Text type="secondary" className="flex items-center text-xs">
            <CalendarOutlined className="mr-1" />
            {prescription.is_dispensed ? 'Dispensed:' : 'Prescribed:'}
          </Text>
          <Text strong className="text-xs">
            {moment(prescription.updatedAt).format('DD MMM YYYY HH:mm')}
          </Text>
        </div>

        {/* Pricing Information */}
        {prescription.medicine && (
          <div className="flex justify-between items-center pt-2 border-t">
            <Text type="secondary" className="flex items-center text-xs">
              <DollarOutlined className="mr-1" />
              Pricing:
            </Text>
            <Space size="small">
              {prescription.medicine.nhia_price > 0 && (
                <Badge 
                  count={`NHIA: GHC ${prescription.medicine.nhia_price}`}
                  style={{ 
                    backgroundColor: '#52c41a',
                    fontSize: '10px',
                    padding: '0 6px'
                  }}
                />
              )}
              <Badge 
                count={`Cash: GHC ${prescription.medicine.market_price}`}
                style={{ 
                  backgroundColor: '#1890ff',
                  fontSize: '10px',
                  padding: '0 6px'
                }}
              />
            </Space>
          </div>
        )}
      </div>

      {/* Pharmacist Notes */}
      {prescription.pharmacist_note && (
        <div className="mt-3 p-2 bg-yellow-50 rounded border">
          <Text type="secondary" className="text-xs font-semibold">Pharmacist Note:</Text>
          <Text className="text-xs block mt-1">{prescription.pharmacist_note}</Text>
        </div>
      )}
    </Card>
  );
};

export default PrescriptionCard;