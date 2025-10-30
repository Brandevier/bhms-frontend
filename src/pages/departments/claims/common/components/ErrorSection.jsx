// src/components/claims/XMLGeneration/components/ErrorSection.jsx
import React from 'react';
import { Button, Alert, Space, Typography } from 'antd';
import { CloseCircleOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ErrorSection = ({ error, onRetry, onCancel, loading }) => {
  const isNoDataError = error?.includes('No claims found') || error?.includes('404');

  return (
    <div className="text-center py-8">
      {isNoDataError ? (
        <>
          <FileTextOutlined className="text-gray-400 text-6xl mb-4" />
          <Title level={4} className="text-gray-600">No Claims Found</Title>
          <Text className="text-gray-500 block mb-4">
            No claims match your selected filters. Please try:
          </Text>
          <div className="text-left text-sm text-gray-600 mb-6">
            • Adjusting your date range<br/>
            • Removing some filters<br/>
            • Checking different patient categories
          </div>
        </>
      ) : (
        <>
          <CloseCircleOutlined className="text-red-500 text-6xl mb-4" />
          <Title level={4} className="text-red-600">Generation Failed</Title>
          <Alert
            message="XML Generation Error"
            description={error || 'An unexpected error occurred while generating the XML file.'}
            type="error"
            showIcon
            className="mb-4 text-left"
          />
        </>
      )}
      
      <Space>
        <Button 
          type="primary" 
          onClick={isNoDataError ? onCancel : onRetry}
          loading={loading}
        >
          {isNoDataError ? 'Adjust Filters' : 'Try Again'}
        </Button>
        <Button onClick={onCancel}>
          Cancel
        </Button>
      </Space>
    </div>
  );
};

export default ErrorSection;