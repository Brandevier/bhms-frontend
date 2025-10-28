import React from 'react';
import { Card, Avatar, Space, Typography, Tag, Badge } from 'antd';
import { UserOutlined, CalendarOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PatientHeader = ({ patient }) => {
  const { 
    first_name, 
    middle_name, 
    last_name, 
    folder_number, 
    status, 
    institution, 
    date_of_birth 
  } = patient;

  const age = date_of_birth ? 
    new Date().getFullYear() - new Date(date_of_birth).getFullYear() : 'N/A';

  return (
    <Card className="mb-6 shadow-sm">
      <div className="flex items-start">
        <Avatar 
          size={64} 
          icon={<UserOutlined />} 
          className="bg-blue-100 text-blue-600 mr-4"
        />
        <div>
          <Title level={3} className="mb-1">
            {`${first_name} ${middle_name || ''} ${last_name}`}
          </Title>
          <Space size="middle">
            <Text>
              <Tag color="geekblue">{folder_number}</Tag>
            </Text>
            <Text>
              <Badge 
                status={status === 'active' ? 'success' : 'error'} 
                text={status} 
              />
            </Text>
            <Text>
              <CalendarOutlined className="mr-1" />
              {age} years
            </Text>
            <Text>
              <HomeOutlined className="mr-1" />
              {institution?.name}
            </Text>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default PatientHeader;