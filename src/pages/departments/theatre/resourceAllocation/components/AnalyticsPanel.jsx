import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { 
  ArrowUpOutlined,
  ArrowDownOutlined,
  DashboardOutlined,
  BarChartOutlined 
} from '@ant-design/icons';

const AnalyticsPanel = () => {
  const stats = [
    { title: 'OR Utilization', value: '78%', trend: 'up', change: '5%' },
    { title: 'Equipment Usage', value: '62%', trend: 'down', change: '3%' },
    { title: 'Staff Utilization', value: '85%', trend: 'up', change: '2%' },
    { title: 'Implant Turnover', value: '4.2 days', trend: 'down', change: '0.5' },
  ];

  const upcomingMaintenance = [
    { equipment: 'C-Arm X-Ray', daysLeft: 15 },
    { equipment: 'Anesthesia Machine', daysLeft: 22 },
    { equipment: 'Surgical Table', daysLeft: 45 },
  ];

  return (
    <Card 
      title={
        <div className="flex items-center">
          <BarChartOutlined className="mr-2" />
          <span>Resource Analytics</span>
        </div>
      } 
      bordered={false} 
      className="shadow-sm h-full"
    >
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} key={index}>
            <Card size="small">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={
                  stat.trend === 'up' ? 
                    <ArrowUpOutlined className="text-green-500" /> : 
                    <ArrowDownOutlined className="text-red-500" />
                }
                suffix={
                  <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {stat.change}
                  </span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
      
      <div className="mt-4">
        <div className="text-gray-600 mb-2">Upcoming Maintenance</div>
        {upcomingMaintenance.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>{item.equipment}</span>
              <span>{item.daysLeft} days</span>
            </div>
            <Progress 
              percent={100 - (item.daysLeft / 90 * 100)} 
              showInfo={false} 
              strokeColor={item.daysLeft < 30 ? '#ff4d4f' : '#faad14'}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AnalyticsPanel;