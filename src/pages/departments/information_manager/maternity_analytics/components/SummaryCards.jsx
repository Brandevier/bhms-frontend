// components/maternity/components/SummaryCards.js
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { WomanOutlined, HeartOutlined, EyeOutlined, ScanOutlined } from '@ant-design/icons';

const SummaryCards = ({ data }) => {
  const cards = [
    {
      title: 'Total Deliveries',
      value: data.totalDeliveries,
      icon: <WomanOutlined />,
      color: '#1890ff'
    },
    {
      title: 'ANC Visits',
      value: data.totalANCVisits,
      icon: <HeartOutlined />,
      color: '#52c41a'
    },
    {
      title: 'PNC Visits',
      value: data.totalPNCVisits,
      icon: <EyeOutlined />,
      color: '#faad14'
    },
    {
      title: 'Ultrasounds',
      value: data.totalUltrasounds,
      icon: <ScanOutlined />,
      color: '#722ed1'
    }
  ];

  return (
    <Card title="Overview Summary" className="h-full">
      <Row gutter={[16, 16]}>
        {cards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
              <Statistic
                title={card.title}
                value={card.value}
                prefix={card.icon}
                valueStyle={{ color: card.color }}
              />
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default SummaryCards;