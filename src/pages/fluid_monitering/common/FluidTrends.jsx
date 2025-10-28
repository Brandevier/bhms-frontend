import React from 'react';
import { Row, Col, Card, Timeline } from 'antd';
import { HistoryOutlined, AlertOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FluidTrends = ({ entries }) => {
  // Generate trends from entries
  const generateTrends = () => {
    const trends = [];
    const now = new Date();
    
    entries.slice(0, 5).forEach(entry => {
      const timeDiff = Math.abs(now - new Date(entry.recorded_at));
      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      
      trends.push({
        time: `${hoursAgo} hours ago`,
        event: `${entry.type === 'intake' ? 'Intake' : 'Output'} recorded: ${entry.amount}ml`,
        type: entry.type,
        status: entry.amount > 500 ? 'success' : 'normal'
      });
    });
    
    return trends;
  };

  const trends = generateTrends();

  // Generate distribution data
  const distributionData = entries.reduce((acc, entry) => {
    const key = entry.category || 'other';
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += parseFloat(entry.amount);
    return acc;
  }, {});

  const chartData = Object.entries(distributionData).map(([name, value]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    value
  }));

  return (
    <Row gutter={[16, 16]} className="mt-6">
      <Col xs={24} lg={12}>
        <Card title="Recent Trends" className="shadow-md" extra={<HistoryOutlined />}>
          <Timeline>
            {trends.map((item, index) => (
              <Timeline.Item
                key={index}
                color={item.status === 'success' ? 'green' : 'blue'}
              >
                <div className="flex justify-between">
                  <span className="font-semibold">{item.event}</span>
                  <span className="text-gray-500 text-sm">{item.time}</span>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card title="Fluid Distribution" className="shadow-md" extra={<AlertOutlined />}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1890ff" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};

export default FluidTrends;