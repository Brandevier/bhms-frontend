// components/lab/components/AbnormalResults.js
import React from 'react';
import { Card, Empty, Typography, Tag } from 'antd';
import { SafetyOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const AbnormalResults = ({ data }) => {
  const hasAbnormalResults = data && data.length > 0;

  return (
    <Card title="Quality Control" className="h-full">
      {hasAbnormalResults ? (
        <div className="text-center">
          <SafetyOutlined className="text-3xl text-red-500 mb-3" />
          <Title level={5} className="text-red-600">Abnormal Results Detected</Title>
          <Text type="secondary">{data.length} tests require review</Text>
          {/* You can expand this to show detailed abnormal results */}
        </div>
      ) : (
        <div className="text-center py-8">
          <CheckCircleOutlined className="text-3xl text-green-500 mb-3" />
          <Title level={5} className="text-green-600">All Results Normal</Title>
          <Text type="secondary">No abnormal test results detected</Text>
          <div className="mt-4">
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Quality Control Passed
            </Tag> 
          </div>
        </div>
      )}
    </Card>
  );
};

export default AbnormalResults;