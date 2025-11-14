import React from 'react';
import { Card, Row, Col, Statistic, Tag } from 'antd';
import { MedicineBoxOutlined, DollarOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const StatisticsCards = ({ medications }) => {
  const totalMedications = medications.length;
  const coveredMeds = medications.filter(med => med.is_nhia_covered).length;
  const avgMarketPrice = medications.length > 0 
    ? medications.reduce((sum, med) => sum + parseFloat(med.market_price || 0), 0) / medications.length 
    : 0;
  const avgNhiaPrice = medications.length > 0 
    ? medications.reduce((sum, med) => sum + parseFloat(med.nhia_price || 0), 0) / medications.length 
    : 0;

  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title="Total Medications"
            value={totalMedications}
            prefix={<MedicineBoxOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title="NHIA Covered"
            value={coveredMeds}
            suffix={`/ ${totalMedications}`}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title="Avg Market Price"
            value={avgMarketPrice}
            precision={2}
            prefix={<DollarOutlined />}
            suffix="GHS"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title="Avg NHIA Price"
            value={avgNhiaPrice}
            precision={2}
            prefix={<DollarOutlined />}
            suffix="GHS"
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticsCards;