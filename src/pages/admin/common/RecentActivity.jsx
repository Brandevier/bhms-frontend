// components/staff/RecentActivity.js
import React from 'react';
import { Card, List, Typography } from 'antd';
import { ClockCircleOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

const RecentActivity = ({ staff, attendance = [] }) => {
  const activities = [
    {
      key: 'login',
      action: "Logged in",
      time: staff.last_login,
      icon: <LoginOutlined className="text-blue-500" />
    },
    {
      key: 'created',
      action: "Account created",
      time: staff.created_at,
      icon: <UserAddOutlined className="text-green-500" />
    },
    ...attendance.slice(0, 3).map((entry, index) => ({
      key: `attendance-${index}`,
      action: "Attendance marked",
      time: entry.scannedAt,
      icon: <ClockCircleOutlined className="text-orange-500" />
    }))
  ];

  return (
    <Card title="Recent Activity" className="mt-6">
      <List
        dataSource={activities}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={item.icon}
              title={item.action}
              description={
                <Text type="secondary">
                  {moment(item.time).format('MMMM Do YYYY, h:mm:ss a')}
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentActivity;