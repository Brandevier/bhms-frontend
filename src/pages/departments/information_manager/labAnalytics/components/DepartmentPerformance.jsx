// components/lab/components/DepartmentPerformance.js
import React from 'react';
import { Card, List, Progress, Tag, Typography } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const DepartmentPerformance = ({ data }) => {
  const totalRequests = data?.reduce((sum, dept) => sum + parseInt(dept.total), 0) || 0;

  return (
    <Card title="Department Test Requests" className="h-full">
      {data?.length > 0 ? (
        <>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <Text strong>Total Lab Requests</Text>
              <Tag color="blue" icon={<TeamOutlined />}>
                {totalRequests} Tests
              </Tag>
            </div>
          </div>

          <List
            dataSource={data}
            renderItem={(dept, index) => {
              const percentage = totalRequests > 0 ? Math.round((dept.total / totalRequests) * 100) : 0;
              return (
                <List.Item>
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <Text strong>{dept.department?.name || 'Unknown Department'}</Text>
                      <Tag color={index === 0 ? 'gold' : 'default'}>{dept.total} tests</Tag>
                    </div>
                    <Progress 
                      percent={percentage} 
                      size="small"
                      strokeColor={index === 0 ? '#ffc53d' : '#1890ff'}
                      showInfo={false}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{percentage}% of total</span>
                      <span>Rank: {index + 1}</span>
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        </>
      ) : (
        <div className="text-center py-8">
          <Text type="secondary">No department data available</Text>
        </div>
      )}
    </Card>
  );
};

export default DepartmentPerformance;