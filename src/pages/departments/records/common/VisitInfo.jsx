import React from 'react';
import { Descriptions, Tag, Badge } from 'antd';

const VisitInfo = ({ latestVisit }) => {
  return (
    <Descriptions bordered column={2}>
      <Descriptions.Item label="Visit Date">
        {latestVisit.visit_date ? 
          new Date(latestVisit.visit_date).toLocaleString() : 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label="Visit Type">
        <Tag color={latestVisit.visit_type === 'Outpatient' ? 'blue' : 'purple'}>
          {latestVisit.visit_type}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Attendance Number">
        <Tag>{latestVisit.attendance_number}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Status">
        <Badge 
          status={latestVisit.status === 'Active' ? 'success' : 'default'} 
          text={latestVisit.status} 
        />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default VisitInfo;