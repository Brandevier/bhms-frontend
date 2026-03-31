import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography } from 'antd';
import { 

  FileTextOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ClaimsSummary = ({ claims }) => {
  // Calculate totals
  const totalClaims = claims.length;
  
  const totalsRaw = claims.reduce((acc, claim) => {
    const claimTotal = claim.total_amount || 0;
    const nhiaTotal = claim.items?.reduce((sum, item) => sum + Math.min(item.amount || 0, item.nhia_amount || 0), 0) || 0;
    const patientTotal = claimTotal - nhiaTotal;
    
    return {
      totalAmount: acc.totalAmount + claimTotal,
      nhiaAmount: acc.nhiaAmount + nhiaTotal,
      patientAmount: acc.patientAmount + patientTotal
    };
  }, { totalAmount: 0, nhiaAmount: 0, patientAmount: 0 });

  const totals = {
    totalAmount: parseFloat(totalsRaw.totalAmount.toFixed(2)),
    nhiaAmount: parseFloat(totalsRaw.nhiaAmount.toFixed(2)),
    patientAmount: parseFloat(totalsRaw.patientAmount.toFixed(2))
  };

  const nhiaPercentage = totals.totalAmount > 0 
    ? Math.round((totals.nhiaAmount / totals.totalAmount) * 10000) / 100 
    : 0;
  const patientPercentage = totals.totalAmount > 0 
    ? Math.round((totals.patientAmount / totals.totalAmount) * 10000) / 100 
    : 0;

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card style={{ marginBottom: 24, borderRadius: 8 }}>
      <Title level={5} style={{ marginBottom: 20 }}>Financial Summary</Title>
      
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
            title="Total Billed"
            value={totals.totalAmount}
            prefix="₵"
            valueStyle={{ color: '#722ed1' }}
          />
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="NHIA Coverage"
            value={totals.nhiaAmount}
            prefix="₵"
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Patient Responsibility"
            value={totals.patientAmount}
            prefix="₵"
            valueStyle={{ color: '#fa8c16' }}
          />
        </Col>
      </Row>

      {/* Amount Distribution */}
      <div style={{ marginTop: 24 }}>
        <Text strong style={{ display: 'block', marginBottom: 12 }}>
          Amount Distribution
        </Text>
        
        <Progress
          percent={Math.round(nhiaPercentage)}
          strokeColor="#52c41a"
          success={{ 
            percent: Math.round(patientPercentage), 
            strokeColor: '#fa8c16' 
          }}
          format={(percent) => `${percent}%`}
        />
        
        <Row gutter={[16, 8]} style={{ marginTop: 12 }}>
          <Col span={12}>
            <Text type="secondary">
              <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                ₵{formatAmount(totals.nhiaAmount)}
              </span>{' '}
              covered by NHIA ({Math.round(nhiaPercentage)}%)
            </Text>
          </Col>
          <Col span={12}>
            <Text type="secondary">
              <span style={{ color: '#fa8c16', fontWeight: 'bold' }}>
                ₵{formatAmount(totals.patientAmount)}
              </span>{' '}
              patient responsibility ({Math.round(patientPercentage)}%)
            </Text>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default ClaimsSummary;