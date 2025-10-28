// DiagnosisHeader.js
import React from 'react';
import { Space, Input, Button, Tooltip, Typography } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  SyncOutlined, 
  FileTextOutlined 
} from '@ant-design/icons';

const { Title } = Typography;

const DiagnosisHeader = ({ onSearch, onAddNew, onRefresh, loading }) => {
  return (
    <Space 
      direction="vertical" 
      style={{ width: '100%', marginBottom: 24 }}
      size="large"
    >
      <Space>
        <FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        <Title level={4} style={{ margin: 0 }}>ICD-10 Diagnosis Management</Title>
      </Space>
      
      <Space>
        <Input.Search
          placeholder="Search by diagnosis name or ICD-10 code..."
          prefix={<SearchOutlined />}
          onSearch={onSearch}
          style={{ width: 400 }}
          allowClear
          enterButton
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={onAddNew}
        >
          Add Diagnosis
        </Button>
        <Tooltip title="Refresh">
          <Button 
            icon={<SyncOutlined />}
            onClick={onRefresh}
            loading={loading}
          />
        </Tooltip>
      </Space>
    </Space>
  );
};

export default DiagnosisHeader;