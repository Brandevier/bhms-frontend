// src/components/claims/XMLGeneration/components/ProgressSection.jsx
import React from 'react';
import { Progress, Typography, Space } from 'antd';

const { Title, Text } = Typography;

const ProgressSection = ({ progress }) => {
  const getProgressMessage = () => {
    if (progress < 30) return 'Fetching claim data...';
    if (progress >= 30 && progress < 70) return 'Processing and validating...';
    if (progress >= 70 && progress < 100) return 'Finalizing XML format...';
    return 'Ready for download!';
  };

  return (
    <div className="text-center py-8">
      <Progress
        type="circle"
        percent={progress}
        size={80}
        className="mb-4"
        format={percent => `${percent}%`}
      />
      <Title level={4}>Generating XML Report</Title>
      <Text type="secondary">
        {progress === 100 ? 'Finalizing download...' : 'Please wait while we process your claims data...'}
      </Text>
      <div className="mt-4">
        <Text className="text-gray-500">
          {getProgressMessage()}
        </Text>
      </div>
    </div>
  );
};

export default ProgressSection;