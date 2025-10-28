// components/itemDetails/MedicationDetails.jsx
import React from 'react';
import { Descriptions, Tag, Divider } from 'antd';
import moment from 'moment';

const MedicationDetails = ({ item }) => {
  if (item.item_type !== 'Medication' || !item.prescription) return null;
  
  return (
    <>
      <Divider orientation="left">Medication Details</Divider>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Dosage">
          {item.prescription.dosage} {item.prescription.doseUnitType}
        </Descriptions.Item>
        <Descriptions.Item label="Frequency">
          {item.prescription.frequency} times per day
        </Descriptions.Item>
        <Descriptions.Item label="Duration">
          {item.prescription.duration} days
        </Descriptions.Item>
        <Descriptions.Item label="Route">
          {item?.prescription?.route}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={item?.prescription?.status === 'dispensed' ? 'green' : 'orange'}>
            {item?.prescription?.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Start Date">
          {moment(item?.prescription?.start_date).format('LL')}
        </Descriptions.Item>
        <Descriptions.Item label="End Date">
          {moment(item.prescription.end_date).format('LL')}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default MedicationDetails;