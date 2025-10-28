import React from 'react';
import { Row, Col, Statistic, Typography, Tag } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;

const InvoiceHeader = ({ totals, invoice, visitId }) => {
  return (
    <div style={{ marginBottom: 24 }}>
      <Row gutter={[24, 16]}>
        <Col span={24}>
          <Title level={3} style={{ marginBottom: 8 }}>Invoice Summary</Title>
        </Col>
        
        <Col xs={24} md={8}>
          <Statistic
            title="Total Billed"
            value={parseFloat(totals?.total_billed_amount || 0)}
            precision={2}
            prefix="₵"
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        
        <Col xs={24} md={8}>
          <Statistic
            title="Amount Paid"
            value={parseFloat(invoice?.amount_paid || 0)}
            precision={2}
            prefix="₵"
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        
        <Col xs={24} md={8}>
          <Statistic
            title="Balance Due"
            value={parseFloat(invoice?.balance_due || 0)}
            precision={2}
            prefix="₵"
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 8]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Text strong>Invoice #: </Text>
          <Tag color="blue">{invoice?.invoice_number || 'N/A'}</Tag>
        </Col>
        
        <Col xs={12} md={6}>
          <Text strong>Issue Date: </Text>
          <br />
          <Text>{invoice?.invoice_date ? moment(invoice.invoice_date).format('MMM DD, YYYY') : 'N/A'}</Text>
        </Col>
        
        <Col xs={12} md={6}>
          <Text strong>Due Date: </Text>
          <br />
          <Text>{invoice?.due_date ? moment(invoice.due_date).format('MMM DD, YYYY') : 'N/A'}</Text>
        </Col>
        
        <Col xs={12} md={6}>
          <Text strong>Status: </Text>
          <br />
          <Tag color={invoice?.status === 'paid' ? 'green' : invoice?.status === 'partially_paid' ? 'orange' : 'red'}>
            {invoice?.status?.toUpperCase() || 'PENDING'}
          </Tag>
        </Col>
        
        <Col xs={12} md={6}>
          <Text strong>Visit ID: </Text>
          <br />
          <Text code>{visitId}</Text>
        </Col>
      </Row>
    </div>
  );
};

export default InvoiceHeader;