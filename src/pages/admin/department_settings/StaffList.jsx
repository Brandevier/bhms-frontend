// StaffList.jsx
import React from 'react';
import { Card, List, Tag, Empty } from 'antd';
import { UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const StaffList = ({ staff }) => {
  return (
    <Card title="Staff Members">
      <List
        dataSource={staff}
        renderItem={(staffMember) => (
          <List.Item>
            <List.Item.Meta
              avatar={<UserOutlined className="text-2xl text-green-500" />}
              title={`${staffMember.firstName || ''} ${staffMember.lastName || ''}`.trim() || 'Unknown Staff'}
              description={
                <div className="space-y-1">
                  <Tag color="green">
                    <SafetyCertificateOutlined /> Staff Member
                  </Tag>
                  {staffMember.email && (
                    <div className="text-xs text-gray-500">
                      Email: {staffMember.email}
                    </div>
                  )}
                  {staffMember.access_type && (
                    <Tag color="blue">Access: {staffMember.access_type}</Tag>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: <Empty description="No staff members in this department" /> }}
      />
    </Card>
  );
};

export default StaffList;