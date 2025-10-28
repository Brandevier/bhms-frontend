import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  TeamOutlined 
} from '@ant-design/icons';

const { Title } = Typography;

const HandoverStats = ({ handovers = [] }) => {
  const stats = {
    total: handovers.length,
    acknowledged: handovers.filter(h => h.status === 'acknowledged').length,
    submitted: handovers.filter(h => h.status === 'submitted').length,
    draft: handovers.filter(h => h.status === 'draft').length,
  };

  const statCards = [
    {
      title: 'Total Handovers',
      value: stats.total,
      icon: <FileTextOutlined />,
      color: '#3b82f6',
      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
    },
    {
      title: 'Acknowledged',
      value: stats.acknowledged,
      icon: <CheckCircleOutlined />,
      color: '#10b981',
      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
    },
    {
      title: 'Pending Review',
      value: stats.submitted,
      icon: <ClockCircleOutlined />,
      color: '#f59e0b',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
    },
    {
      title: 'Drafts',
      value: stats.draft,
      icon: <TeamOutlined />,
      color: '#8b5cf6',
      background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)'
    }
  ];

  return (
    <div className="mb-6">
      <Title level={4} className="text-gray-700 mb-4">Overview</Title>
      <Row gutter={16}>
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index} className="mb-4">
            <Card 
              className="border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              style={{ background: stat.background }}
              bodyStyle={{ padding: '20px' }}
            >
              <Statistic
                title={
                  <span style={{ color: stat.color }} className="font-semibold">
                    {stat.title}
                  </span>
                }
                value={stat.value}
                prefix={
                  <span style={{ color: stat.color }} className="text-2xl">
                    {stat.icon}
                  </span>
                }
                valueStyle={{ color: stat.color, fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HandoverStats;