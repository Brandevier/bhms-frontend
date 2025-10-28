// components/itemDetails/GeneralInfo.jsx
import React from 'react';
import { Descriptions, Tag } from 'antd';
import { 
  MedicineBoxOutlined, 
  ExperimentOutlined, 
  DashboardOutlined,
  FileTextOutlined 
} from '@ant-design/icons';
import moment from 'moment';

const GeneralInfo = ({ item }) => {
  const getItemIcon = () => {
    switch (item.item_type) {
      case 'Medication': return <MedicineBoxOutlined className="text-blue-500" />;
      case 'LabTest': return <ExperimentOutlined className="text-green-500" />;
      case 'Diagnosis': return <DashboardOutlined className="text-red-500" />;
      case 'Procedure': return <FileTextOutlined className="text-purple-500" />;
      default: return <FileTextOutlined />;
    }
  };

  const getItemTypeColor = () => {
    switch (item.item_type) {
      case 'Medication': return 'blue';
      case 'LabTest': return 'green';
      case 'Diagnosis': return 'red';
      case 'Procedure': return 'purple';
      default: return 'default';
    }
  };

  return (
    <Descriptions column={1} bordered size="small">
      <Descriptions.Item label="Item Type">
        <Tag color={getItemTypeColor()}>
          {getItemIcon()} {item.item_type}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Description">
        {item.description || 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label="Date Performed">
        {item.date_performed ? moment(item.date_performed).format('LLL') : 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label="Quantity">
        {item.quantity}
      </Descriptions.Item>
      <Descriptions.Item label="Unit Price">
        {item.unit_price ? `GHS ${item.unit_price}` : 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label="Total Amount">
        {item.amount ? `GHS ${item.amount}` : 'N/A'}
      </Descriptions.Item>
      {item.gdrg_code && (
        <Descriptions.Item label="GDRG Code">
          {item.gdrg_code}
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default GeneralInfo;