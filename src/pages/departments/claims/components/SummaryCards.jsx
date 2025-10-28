import React from 'react';
import { Row, Col, Card, Statistic, Spin } from 'antd';
import { 
  DollarCircleOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';

const SummaryCards = ({ summary, loading }) => {
  if (!summary && loading) {
    return (
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Spin /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Spin /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Spin /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Spin /></Card>
        </Col>
      </Row>
    );
  }

  if (!summary) return null;

  const { totalClaims, totalAmount, statusBreakdown } = summary;

  return (
    <Row gutter={16}>
      <Col xs={24} sm={12} lg={6} className="mb-4">
        <Card className="shadow-sm border-0">
          <Statistic
            title="Total Claims"
            value={totalClaims || 0}
            prefix={<FileTextOutlined className="text-blue-500" />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} lg={6} className="mb-4">
        <Card className="shadow-sm border-0">
          <Statistic
            title="Total Amount"
            value={totalAmount || 0}
            precision={2}
            prefix="₵"
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} lg={6} className="mb-4">
        <Card className="shadow-sm border-0">
          <Statistic
            title="Pending Claims"
            value={statusBreakdown?.pending || 0}
            prefix={<ClockCircleOutlined className="text-orange-500" />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} lg={6} className="mb-4">
        <Card className="shadow-sm border-0">
          <Statistic
            title="Approved Claims"
            value={statusBreakdown?.approved || 0}
            prefix={<CheckCircleOutlined className="text-green-500" />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;