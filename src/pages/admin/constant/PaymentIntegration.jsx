import React, { useState } from 'react';
import { Input, Row, Col, Button, Tooltip, Typography, Checkbox } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import BhmsButton from '../../../heroComponents/BhmsButton';

const { Text } = Typography;

const PaymentIntegration = () => {
  const [policyAccepted, setPolicyAccepted] = useState(false);
  
  const handlePolicyChange = (e) => {
    setPolicyAccepted(e.target.checked);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={24}>
        {/* Column 1 */}
        <Col span={12} className='my-3'>
          <Tooltip title="Enter the business name of the institution">
            <Input placeholder="Business Name" />
          </Tooltip>
        </Col>
        <Col span={12} className='my-3'>
          <Tooltip title="Full name of the administrator managing the payment system">
            <Input placeholder="Administrator Full Name" />
          </Tooltip>
        </Col>
        <Col span={12} className='my-3'>
          <Tooltip title="Enter the settlement bank name">
            <Input placeholder="Settlement Bank" />
          </Tooltip>
        </Col>
        <Col span={12} className='my-3'>
          <Tooltip title="Bank account number for receiving payments">
            <Input placeholder="Account Number" />
          </Tooltip>
        </Col>
        <Col span={12} className='my-3'>
          <Tooltip title="Percentage charge applicable for transactions">
            <Input placeholder="Percentage Charge" />
          </Tooltip>
        </Col>
        <Col span={12} className='my-3'>
          <Tooltip title="Primary contact person's full name">
            <Input placeholder="Primary Contact Name" />
          </Tooltip>
        </Col>
        <Col span={12} className='my-3'>
          <Tooltip title="Email address of the primary contact person">
            <Input placeholder="Primary Contact Email" />
          </Tooltip>
        </Col>
        <Col span={12} className='my-3'>
          <Tooltip title="Primary contact phone number">
            <Input placeholder="Primary Contact Phone" />
          </Tooltip>
        </Col>
      </Row>

      <div style={{ marginTop: '20px' }}>
        <Tooltip title="Click to read the full policy">
          <Text type="secondary" style={{ cursor: 'pointer' }}>
            <InfoCircleOutlined /> Hospital Financial Transactions and Integrity Policy
          </Text>
        </Tooltip>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Checkbox checked={policyAccepted} onChange={handlePolicyChange}>
          I accept the Hospital Financial Transactions and Integrity Policy
        </Checkbox>
      </div>

      <div style={{ marginTop: '20px' }}>
        <BhmsButton type="primary" disabled={!policyAccepted}>
          Create Payment Account
        </BhmsButton>
      </div>
    </div>
  );
};

export default PaymentIntegration;
