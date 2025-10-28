// components/patient/AdmissionStatsCard.js
import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Text } = Typography;

const AdmissionStatsCard = ({ admissionStats }) => {
  const totalAdmissions = (admissionStats?.admissions || 0) + (admissionStats?.outpatients || 0);
  const admissionRate = totalAdmissions > 0 ? 
    Math.round((admissionStats?.admissions / totalAdmissions) * 100) : 0;
  const outpatientRate = totalAdmissions > 0 ? 
    Math.round((admissionStats?.outpatients / totalAdmissions) * 100) : 0;

  return (
    <Card title="Admission Statistics" className="w-full">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Statistic
            title="Total Admissions"
            value={admissionStats?.admissions || 0}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col xs={24} sm={12}>
          <Statistic
            title="Outpatients"
            value={admissionStats?.outpatients || 0}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
      </Row>

      {totalAdmissions > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <Text>Inpatient Admissions</Text>
              <Text>{admissionRate}%</Text>
            </div>
            <Progress percent={admissionRate} strokeColor="#1890ff" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <Text>Outpatient Visits</Text>
              <Text>{outpatientRate}%</Text>
            </div>
            <Progress percent={outpatientRate} strokeColor="#52c41a" />
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <Text strong>Admission Rate: </Text>
            <Text>{admissionRate}% of total visits require admission</Text>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AdmissionStatsCard;