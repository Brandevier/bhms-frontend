import React from 'react';
import { Statistic, Row, Col, Card } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';

const PatientOverview = ({ patient }) => {
  return (
    <Card className="mb-4 shadow-sm">
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Statistic 
            title="Patient" 
            value={patient?.name} 
            prefix={<UserOutlined />} 
          />
          <div className="text-gray-500 text-sm mt-1">MRN: {patient?.mrn}</div>
        </Col>
        <Col xs={24} md={8}>
          <Statistic 
            title="Procedure" 
            value={patient?.procedure} 
          />
          <div className="text-gray-500 text-sm mt-1">
            {new Date(patient?.surgeryTime).toLocaleString()}
          </div>
        </Col>
        <Col xs={24} md={8}>
          <Statistic 
            title="PACU Time" 
            value={`${Math.floor((new Date() - new Date(patient?.pacuAdmission)) / 3600000)}h 32m`} 
            prefix={<ClockCircleOutlined />} 
          />
        </Col>
      </Row>
    </Card>
  );
};

export default PatientOverview;