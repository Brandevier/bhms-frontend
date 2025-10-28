import React from 'react';
import { Row, Col, Tag } from 'antd';

const DrugInfo = ({ drug }) => {
  if (!drug) return null;

  return (
    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
      <Row gutter={16}>
        <Col span={12}>
          <div className="mb-2">
            <strong>NHIA Coverage:</strong>{' '}
            <Tag color={drug.is_nhia_covered ? 'green' : 'red'}>
              {drug.is_nhia_covered ? 'Covered' : 'Not Covered'}
            </Tag>
          </div>
          {drug.is_nhia_covered && (
            <div><strong>NHIA Price:</strong> GHC {drug.nhia_price}</div>
          )}
        </Col>
        <Col span={12}>
          <div><strong>Market Price:</strong> GHC {drug.market_price}</div>
          <div><strong>Strength:</strong> {drug.strength}</div>
          <div><strong>Unit:</strong> {drug.unit_of_pricing}</div>
        </Col>
      </Row>
    </div>
  );
};

export default DrugInfo;