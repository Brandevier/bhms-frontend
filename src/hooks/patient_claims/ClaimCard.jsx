import React, { useState } from 'react';
import { Card, Row, Col, Typography, Tag, Button, Space, Collapse } from 'antd';
import { 
  EyeOutlined, 
  FilePdfOutlined, 
  CalendarOutlined,
  DollarOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons';
import moment from 'moment';
import ClaimItemsSection from './ClaimItemsSection';

const { Text, Title } = Typography;
const { Panel } = Collapse;

const ClaimCard = ({ claim, onViewDetails }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'submitted': return 'blue';
      default: return 'default';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount || 0);
  };

  // Calculate totals with market_price display, patient payment indicator
  const claimTotals = claim.items?.reduce((acc, item) => {
    const itemTotal = item.unit_price * (item.quantity || 1);
    const marketTotal = acc.marketTotal + itemTotal;
    const nhiaAmount = Math.min(itemTotal, item.nhia_amount || 0);
    const patientAmount = Math.max(0, itemTotal - nhiaAmount);
    
    return {
      marketTotal: marketTotal,
      total: acc.total + item.amount,
      nhia: acc.nhia + nhiaAmount,
      patient: acc.patient + patientAmount,
      paidItems: acc.paidItems + (item.paid_by_patient === true ? 1 : 0)
    };
  }, { marketTotal: 0, total: 0, nhia: 0, patient: 0, paidItems: 0 });

  return (
    <Card
      style={{ 
        width: '100%',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0'
      }}
      bodyStyle={{ padding: '16px' }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={10}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div>
              <Text strong>Claim #: </Text>
              <Text code>{claim.claim_reference_number}</Text>
            </div>
            
            <div>
              <Text strong>Status: </Text>
              <Tag color={getStatusColor(claim.claim_status)}>
                {claim.claim_status || 'Unknown'}
              </Tag>
            </div>
            
            <div>
              <CalendarOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
              <Text type="secondary">
                Submitted: {moment(claim.submission_date).format('MMM D, YYYY')}
              </Text>
            </div>
          </Space>
        </Col>

        <Col xs={24} md={8}>
          <Space direction="vertical" size="small">
            <div>
              <Text strong>Market: </Text>
              <Text strong>{formatAmount(claimTotals.marketTotal)}</Text>
            </div>
            <div>
              <Text type="success">NHIA: {formatAmount(claimTotals.nhia)}</Text>
            </div>
            <div>
              <Text type="warning">Patient: {formatAmount(claimTotals.patient)}</Text>
              {claimTotals.paidItems > 0 && (
                <Tag color="green" size="small" className="ml-2">
                  {claimTotals.paidItems} Paid
                </Tag>
              )}
            </div>
          </Space>
        </Col>

        <Col xs={24} md={6}>
          <Space>
            <Button
              type="primary"
              icon={expanded ? <UpOutlined /> : <DownOutlined />}
              onClick={() => setExpanded(!expanded)}
              size="small"
            >
              {expanded ? 'Hide Items' : 'Show Items'}
            </Button>
            
            <Button
              icon={<FilePdfOutlined />}
              size="small"
            >
              PDF
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Expandable Items Section */}
      {expanded && (
        <ClaimItemsSection items={claim.items} />
      )}
    </Card>
  );
};

export default ClaimCard;