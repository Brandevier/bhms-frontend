// components/maternity/ANCVisitDetails.js
import React from 'react';
import { Card, Typography, Tag } from 'antd';

const { Text } = Typography;

const ANCVisitDetails = ({ ancRecord }) => {
  return (
    <Card title="Visit Details">
      <div className="space-y-3">
        <div className="flex justify-between">
          <Text strong>Year:</Text>
          <Text>{ancRecord?.year || 'N/A'}</Text>
        </div>
        <div className="flex justify-between">
          <Text strong>Created At:</Text>
          <Text>
            {ancRecord?.createdAt ? new Date(ancRecord.createdAt).toLocaleDateString() : 'N/A'}
          </Text>
        </div>
        <div className="flex justify-between">
          <Text strong>Last Updated:</Text>
          <Text>
            {ancRecord?.updatedAt ? new Date(ancRecord.updatedAt).toLocaleDateString() : 'N/A'}
          </Text>
        </div>
        <div className="flex justify-between">
          <Text strong>Status:</Text>
          <Tag color="green">Active</Tag>
        </div>
      </div>
    </Card>
  );
};

export default ANCVisitDetails;