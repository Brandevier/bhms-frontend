// components/bed/BedSummaryCards.js
import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { BoxPlotFilled } from '@ant-design/icons';

const BedSummaryCards = ({ totalBeds, occupiedCount, availableCount, occupancyRate }) => {
  const stats = [
    {
      title: 'Total Beds',
      value: totalBeds || 0,
      prefix: <BoxPlotFilled />,
      color: '#3f8600'
    },
    {
      title: 'Occupied Beds',
      value: occupiedCount,
      color: '#cf1322'
    },
    {
      title: 'Available Beds',
      value: availableCount,
      color: '#52c41a'
    },
    {
      title: 'Occupancy Rate',
      value: occupancyRate,
      color: '#1890ff'
    }
  ];

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {stats.map((stat, index) => (
        <Col xs={24} sm={8} lg={6} key={index}>
          <Card>
            <Statistic
              title={stat.title}
              value={stat.value}
              prefix={stat.prefix}
              valueStyle={{ color: stat.color }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default BedSummaryCards;