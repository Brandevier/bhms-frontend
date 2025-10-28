// components/staff/StaffProfileCard.js
import React from 'react';
import { Card, Avatar, Typography, Tag, Divider, Button, Space } from 'antd';
import { PhoneOutlined, MailOutlined, KeyOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StaffProfileCard = ({ staff, onResetPassword, onDelete }) => {
  const { firstName, lastName, email, phone_number, department, role, staffID } = staff;

  return (
    <Card className="h-full">
      <div className="text-center">
        <Avatar size={100} src="/assets/user.png" className="mb-4" />
        <Title level={4} className="mb-1">{firstName} {lastName}</Title>
        <Text type="secondary">{role?.name}</Text>
        <div className="mt-3">
          <Tag color="green">Active</Tag>
        </div>
      </div>
      <Divider />

      <div className="space-y-3">
        <div>
          <Text strong>Department:</Text>
          <p className="text-gray-700">{department?.name}</p>
        </div>
        
        <div>
          <Text strong>Staff ID:</Text>
          <p className="text-gray-700">{staffID}</p>
        </div>
        
        <div>
          <Text strong>Email:</Text>
          <p className="text-gray-700 flex items-center">
            <MailOutlined className="mr-2" /> {email}
          </p>
        </div>
        
        <div>
          <Text strong>Phone:</Text>
          <p className="text-gray-700 flex items-center">
            <PhoneOutlined className="mr-2" /> {phone_number}
          </p>
        </div>
      </div>

      <Divider />
      
      <Space direction="vertical" className="w-full">
        <Button 
          type="primary" 
          icon={<KeyOutlined />} 
          block
          onClick={onResetPassword}
          className="flex items-center justify-center"
        >
          Reset Password
        </Button>
        <Button 
          danger 
          icon={<DeleteOutlined />} 
          block
          onClick={onDelete}
          className="flex items-center justify-center"
        >
          Delete Staff
        </Button>
      </Space>
    </Card>
  );
};

export default StaffProfileCard;