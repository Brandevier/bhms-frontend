import React, { useState } from 'react';
import { Card, Row, Col, Typography, Empty, Spin } from 'antd';
import { InsuranceOutlined } from '@ant-design/icons';
import ClaimsSummary from './ClaimsSummary';
import ClaimsList from './ClaimsList';

const { Title, Text } = Typography;

const PatientClaims = ({ claimsData, loading }) => {
  const [selectedClaim, setSelectedClaim] = useState(null);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!claimsData || claimsData.length === 0) {
    return (
      <Card>
        <Empty 
          description="No insurance claims found for this patient"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <InsuranceOutlined style={{ fontSize: 24, color: '#1890ff', marginRight: 12 }} />
            <Title level={3} style={{ margin: 0 }}>NHIS Claims & Billing</Title>
          </div>
          <Text type="secondary">
            National Health Insurance Scheme claims and patient billing details
          </Text>
        </Col>
      </Row>

      {/* Claims Summary with NHIA and Patient amounts */}
      <ClaimsSummary claims={claimsData} />

      {/* Claims List */}
      <ClaimsList 
        claims={claimsData} 
        onSelectClaim={setSelectedClaim}
      />
    </div>
  );
};

export default PatientClaims;