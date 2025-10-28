// components/itemDetails/ProcedureDetails.jsx
import React from 'react';
import { Descriptions, Tag, Divider } from 'antd';

const ProcedureDetails = ({ item }) => {
  if (item.item_type !== 'Procedure' || !item.procedure) return null;
  
  return (
    <>
      <Divider orientation="left">Procedure Details</Divider>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Procedure Date">
          {new Date(item.procedure.procedure_datetime).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={item.procedure.status === 'completed' ? 'green' : 'blue'}>
            {item.procedure.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Department">
          {item.procedure.department_id ? `Department ${item.procedure.department_id}` : 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default ProcedureDetails;