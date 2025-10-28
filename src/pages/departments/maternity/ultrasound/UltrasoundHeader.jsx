// components/maternity/UltrasoundHeader.js
import React from 'react';
import { Typography, Button, Space } from 'antd';
import { PlusOutlined, UserOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UltrasoundHeader = ({ loading, onRefresh, onAddNew }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center">
        <UserOutlined className="text-blue-500 text-xl mr-3" />
        <div>
          <Title level={4} className="mb-0">Ultrasound Records</Title>
          <Text type="secondary" className="text-sm">
            Manage patient ultrasound scans and images
          </Text>
        </div>
      </div>
      
      <Space>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={onRefresh}
          loading={loading}
          size="middle"
        >
          Refresh
        </Button>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onAddNew}
          size="middle"
        >
          Add Ultrasound
        </Button>
      </Space>
    </div>
  );
};

export default UltrasoundHeader;