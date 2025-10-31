// components/lab/components/StaffPerformance.js
import React from 'react';
import { Card, List, Avatar, Tag, Typography } from 'antd';
import { UserOutlined, TrophyOutlined } from '@ant-design/icons';

const { Text } = Typography;

const StaffPerformance = ({ data }) => {
  return (
    <Card title="Staff Performance" className="h-full">
      {data?.length > 0 ? (
        <List
          dataSource={data}
          renderItem={(staff, index) => (
            <List.Item>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Avatar 
                    size="large" 
                    icon={<UserOutlined />}
                    className="mr-3"
                    style={{ 
                      backgroundColor: index === 0 ? '#ffd666' : '#87d068'
                    }}
                  />
                  <div>
                    <Text strong>
                      {staff.verifier?.firstName} {staff.verifier?.lastName}
                    </Text>
                    <div className="text-xs text-gray-500">
                      ID: {staff.verifier?.id?.slice(0, 8)}...
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Tag 
                    color={index === 0 ? 'gold' : 'blue'} 
                    icon={index === 0 ? <TrophyOutlined /> : null}
                  >
                    {staff.total} tests verified
                  </Tag>
                  <div className="text-xs text-gray-500 mt-1">
                    Rank #{index + 1}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <div className="text-center py-8">
          <Text type="secondary">No staff performance data available</Text>
        </div>
      )}
    </Card>
  );
};

export default StaffPerformance;