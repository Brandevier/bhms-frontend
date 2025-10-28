// components/itemDetails/NHIAInformation.jsx
import React from 'react';
import { Descriptions, Tag, Divider } from 'antd';

const NHIAInformation = ({ item }) => {
  if (item.nhia_amount === null && item.nhia_amount === undefined) return null;
  
  return (
    <>
      <Divider orientation="left">NHIA Information</Divider>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="NHIA Amount">
          GHS {item.nhia_amount}
        </Descriptions.Item>
        <Descriptions.Item label="Paid by Patient">
          <Tag color={item.paid_by_patient ? 'red' : 'green'}>
            {item.paid_by_patient ? 'Yes' : 'No'}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default NHIAInformation;