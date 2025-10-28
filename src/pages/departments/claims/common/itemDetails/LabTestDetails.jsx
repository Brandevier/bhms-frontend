// components/itemDetails/LabTestDetails.jsx
import React from 'react';
import { Descriptions, Tag, Divider } from 'antd';

const LabTestDetails = ({ item }) => {
  if (item.item_type !== 'LabTest' || !item.labTest) return null;
  
  return (
    <>
      <Divider orientation="left">Lab Test Details</Divider>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Test Type">
          {item.labTest.test_type || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={
            item.labTest.status === 'completed' ? 'green' : 
            item.labTest.status === 'pending' ? 'orange' : 'blue'
          }>
            {item.labTest.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Results">
          {item.labTest.results || 'No results yet'}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default LabTestDetails;