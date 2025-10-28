import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { 
  UserOutlined, 
  SyncOutlined, 
  LineChartOutlined, 
  UserAddOutlined 
} from '@ant-design/icons';

const PatientStats = ({ patients }) => {
  const stats = [
    {
      title: 'Total Visits',
      value: patients?.length || 0,
      icon: <UserOutlined className="text-blue-500" />,
      color: '#3f51b5'
    },
    {
      title: 'Active Visits',
      value: patients?.filter(p => p?.status === 'Active').length || 0,
      icon: <SyncOutlined className="text-green-500" />,
      color: '#4caf50'
    },
    {
      title: 'OPD Visits',
      value: patients?.filter(p => p?.visit_type === 'General OPD').length || 0,
      icon: <LineChartOutlined className="text-orange-500" />,
      color: '#ff9800'
    },
    {
      title: 'New Today',
      value: patients?.filter(p => p?.createdAt && new Date(p.createdAt).toDateString() === new Date().toDateString()).length || 0,
      icon: <UserAddOutlined className="text-purple-500" />,
      color: '#9c27b0'
    }
  ];

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {stats.map((stat, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card className="border-0 shadow-sm rounded-xl bg-gradient-to-r from-gray-50 to-blue-50">
            <Statistic
              title={stat.title}
              value={stat.value}
              prefix={stat.icon}
              valueStyle={{ color: stat.color, fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PatientStats;