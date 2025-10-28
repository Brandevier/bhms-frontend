import React from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, Typography } from 'antd';
import { 
  DollarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  FileTextOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const ClaimsAnalytics = ({ claims }) => {
  // Calculate analytics
  const totalClaims = claims.length;
  const totalAmount = claims.reduce((sum, claim) => sum + (claim.total_amount || 0), 0);
  
  const statusCounts = claims.reduce((acc, claim) => {
    const status = claim.claim_status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pendingClaims = statusCounts['Pending'] || 0;
  const approvedClaims = statusCounts['Approved'] || 0;
  const rejectedClaims = statusCounts['Rejected'] || 0;

  return (
    <Card style={{ marginBottom: 24, borderRadius: 8 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Total Claims"
            value={totalClaims}
            prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Total Amount"
            value={totalAmount}
            prefix="₵"
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Pending Claims"
            value={pendingClaims}
            prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Approved Claims"
            value={approvedClaims}
            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
      </Row>

      {/* Status Distribution */}
      <div style={{ marginTop: 24 }}>
        <Text strong style={{ display: 'block', marginBottom: 12 }}>Claim Status Distribution</Text>
        <Row gutter={[8, 8]} align="middle">
          <Col span={6}>
            <Tag color="blue">Pending: {pendingClaims}</Tag>
          </Col>
          <Col span={6}>
            <Tag color="green">Approved: {approvedClaims}</Tag>
          </Col>
          <Col span={6}>
            <Tag color="red">Rejected: {rejectedClaims}</Tag>
          </Col>
          <Col span={6}>
            <Tag color="default">Other: {totalClaims - pendingClaims - approvedClaims - rejectedClaims}</Tag>
          </Col>
        </Row>
        
        <Progress
          percent={Math.round((pendingClaims / totalClaims) * 100)}
          strokeColor="#faad14"
          success={{ percent: Math.round((approvedClaims / totalClaims) * 100), strokeColor: '#52c41a' }}
          showInfo={false}
          style={{ marginTop: 12 }}
        />
      </div>
    </Card>
  );
};

export default ClaimsAnalytics;