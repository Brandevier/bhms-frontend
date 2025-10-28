// components/maternity/ANCBasicInfo.js
import React from 'react';
import { Card, Typography, Button, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ANCBasicInfo = ({ ancRecord }) => {
  return (
    <Card title="Basic Information" extra={<Button icon={<EditOutlined />} size="small">Edit</Button>}>
      <div className="space-y-3">
        <div className="flex justify-between">
          <Text strong>Parity:</Text>
          <Text>{ancRecord?.parity !== null && ancRecord?.parity !== undefined ? ancRecord.parity : 'N/A'}</Text>
        </div>
        <div className="flex justify-between">
          <Text strong>Blood Pressure:</Text>
          <Text>{ancRecord?.blood_pressure || 'N/A'}</Text>
        </div>
        <div className="flex justify-between">
          <Text strong>Hemoglobin Level:</Text>
          <Text>
            {ancRecord?.hemoglobin_level !== null && ancRecord?.hemoglobin_level !== undefined 
              ? `${ancRecord.hemoglobin_level} g/dL` 
              : 'N/A'
            }
          </Text>
        </div>
        <div className="flex justify-between">
          <Text strong>HIV Status:</Text>
          <Tag 
            color={
              ancRecord?.hiv_status === 'Positive' ? 'red' : 
              ancRecord?.hiv_status === 'Negative' ? 'green' : 'orange'
            }
          >
            {ancRecord?.hiv_status || 'Unknown'}
          </Tag>
        </div>
      </div>
    </Card>
  );
};

export default ANCBasicInfo;