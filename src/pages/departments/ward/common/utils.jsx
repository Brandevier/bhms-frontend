import { Tag } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

export const getStatusTag = (admission_status) => {
  const statusMap = {
    pending: { color: 'orange', icon: <ClockCircleOutlined /> },
    accepted: { color: 'green', icon: <CheckCircleOutlined /> },
    rejected: { color: 'red', icon: <CloseCircleOutlined /> },
    discharged: { color: 'default', icon: null }
  };
  
  const config = statusMap[admission_status] || { color: 'blue', icon: null };
  
  return (
    <Tag color={config.color} icon={config.icon}>
      {admission_status?.toUpperCase()}
    </Tag>
  );
};