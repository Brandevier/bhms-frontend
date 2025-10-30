// src/components/claims/XMLGeneration/components/SuccessSection.jsx
import React from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

const SuccessSection = ({ onDownload, onClose, generatedData }) => {
  return (
    <div className="text-center py-8">
      <div className="text-green-500 text-6xl mb-4">✓</div>
      <Title level={4} className="text-green-600">XML Generated Successfully!</Title>
      <Text className="text-gray-600 block mb-6">
        Your claims data has been processed and formatted according to NHIS standards.
      </Text>
      
      <Card size="small" className="mb-4 text-left">
        <div className="flex justify-between items-center">
          <div>
            <Text strong>File Details:</Text>
            <div className="text-sm text-gray-600">
              • Format: XML (NHIS Standard)<br/>
              • Generated: {moment().format('YYYY-MM-DD HH:mm')}<br/>
              • Records: {generatedData?.recordCount || 'Multiple'}
            </div>
          </div>
        </div>
      </Card>

      <Space size="middle">
        <Button 
          type="primary" 
          icon={<DownloadOutlined />}
          onClick={onDownload}
          size="large"
        >
          Download XML File
        </Button>
        <Button 
          onClick={onClose}
          size="large"
        >
          Close
        </Button>
      </Space>
    </div>
  );
};

export default SuccessSection;