// components/itemDetails/DiagnosisDetails.jsx
import React from 'react';
import { Descriptions, Tag, Divider } from 'antd';

const DiagnosisDetails = ({ item }) => {
  if (item.item_type !== 'Diagnosis' || !item.diagnosis) return null;
  
  return (
    <>
      <Divider orientation="left">Diagnosis Details</Divider>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="ICD-10 Code">
          {item.diagnosis.systemDiagnosis?.icd_10_code || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Diagnosis Name">
          {item.diagnosis.systemDiagnosis?.diagnosis_name || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={item.diagnosis.status === 'Active' ? 'green' : 'red'}>
            {item.diagnosis.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Diagnosis Date">
          {new Date(item.diagnosis.diagnosis_date).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Notes">
          {item.diagnosis.notes || 'No notes provided'}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default DiagnosisDetails;