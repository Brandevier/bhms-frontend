import React from 'react';
import { Tag, Row, Col,Card } from 'antd';

const StatusLegend = () => {
  const statuses = [
    { label: 'Available', value: 'available', color: 'green' },
    { label: 'In Progress', value: 'in-progress', color: 'red' },
    { label: 'Cleaning', value: 'cleaning', color: 'orange' },
    { label: 'Prep', value: 'prep', color: 'blue' },
  ];

  return (
    <Card bordered={false} className="shadow-sm">
      <div className="text-gray-600 mb-2">Room Status Legend</div>
      <Row gutter={[8, 8]}>
        {statuses.map(status => (
          <Col key={status.value}>
            <Tag color={status.color}>{status.label}</Tag>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default StatusLegend;