// components/lab/components/TopTestsChart.js
import React from 'react';
import { Card, List, Tag, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Text } = Typography;

const TopTestsChart = ({ data }) => {
  const chartData = data?.map((test, index) => ({
    name: test.template?.description || 'Unknown Test',
    count: parseInt(test.total),
    rank: index + 1
  })) || [];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

  return (
    <Card title="Most Requested Tests" className="h-full">
      {chartData.length > 0 ? (
        <>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="count" 
                  name="Test Count"
                  fill={colors[0]}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <List
            size="small"
            dataSource={chartData}
            renderItem={(item, index) => (
              <List.Item>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center">
                    <Tag color={colors[index % colors.length]}>{index + 1}</Tag>
                    <Text className="ml-2" ellipsis={{ tooltip: item.name }}>
                      {item.name}
                    </Text>
                  </div>
                  <Tag color="blue">{item.count} requests</Tag>
                </div>
              </List.Item>
            )}
          />
        </>
      ) : (
        <div className="text-center py-8">
          <Text type="secondary">No test data available</Text>
        </div>
      )}
    </Card>
  );
};

export default TopTestsChart;