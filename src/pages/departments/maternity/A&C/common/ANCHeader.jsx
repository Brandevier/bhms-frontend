// components/maternity/ANCHeader.js
import React from 'react';
import { Typography, Button } from 'antd';
import { HeartOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ANCHeader = ({ loading, onRefresh }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Title level={3} className="flex items-center">
        <HeartOutlined className="mr-2 text-pink-500" />
        ANC Record
      </Title>
      <Button 
        icon={<ReloadOutlined />} 
        onClick={onRefresh}
        loading={loading}
      >
        Refresh
      </Button>
    </div>
  );
};

export default ANCHeader;