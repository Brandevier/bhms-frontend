import React from 'react';
import { Row, Col, Typography, Tag } from 'antd';

const { Text } = Typography;

const ClaimItemRow = ({ item }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount || 0);
  };

  const totalAmount = item.amount || 0;
  const nhiaAmount = item.nhia_amount || 0;
  const patientAmount = totalAmount - nhiaAmount;

  return (
    <Row gutter={[16, 8]} style={{ padding: '8px 0' }}>
      <Col span={12}>
        <div>
          <Text strong>Description: </Text>
          <Text>{item.description || 'N/A'}</Text>
        </div>
        <div>
          <Text strong onClick={()=>console.log(item)}>GDRG Code: </Text>
          <Tag>{item.gdrg_code || 'N/A'}</Tag>
        </div>
        {item.date_performed && (
          <div>
            <Text strong>Date: </Text>
            <Text type="secondary">
              {new Date(item.date_performed).toLocaleDateString()}
            </Text>
          </div>
        )}
      </Col>

      <Col span={12}>
        <div style={{ textAlign: 'right' }}>
          <div>
            <Text strong>Total: </Text>
            <Text>{formatAmount(totalAmount)}</Text>
          </div>
          <div>
            <Text type="success">NHIA: {formatAmount(nhiaAmount)}</Text>
          </div>
          <div>
            <Text type="warning">Patient: {formatAmount(patientAmount)}</Text>
          </div>
          {item.co_payment && (
            <div>
              <Text type="secondary">Co-payment: {formatAmount(item.co_payment)}</Text>
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default ClaimItemRow;