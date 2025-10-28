import React from 'react';
import { Alert, List, Tag, Button } from 'antd';
import { 
  WarningOutlined,
  TeamOutlined,
  ToolOutlined 
} from '@ant-design/icons';

const ResourceConflictAlert = () => {
  const conflicts = [
    {
      id: 'conf-001',
      type: 'equipment',
      message: 'C-Arm X-Ray requested for OR 1 and OR 3 at 09:00 AM',
      severity: 'high',
      resources: ['XRAY-001']
    },
    {
      id: 'conf-002',
      type: 'staff',
      message: 'Dr. Smith assigned to two overlapping procedures',
      severity: 'medium',
      resources: ['Dr. Smith']
    },
    {
      id: 'conf-003',
      type: 'implant',
      message: 'Low stock of Hip Prosthesis (2 remaining)',
      severity: 'medium',
      resources: ['IMP-10023']
    },
  ];

  const getConflictIcon = (type) => {
    switch(type) {
      case 'equipment':
        return <ToolOutlined className="mr-2" />;
      case 'staff':
        return <TeamOutlined className="mr-2" />;
      default:
        return <WarningOutlined className="mr-2" />;
    }
  };

  return (
    <div>
      {conflicts.length > 0 ? (
        <Alert
          message={
            <div className="flex justify-between items-center">
              <span>
                <WarningOutlined className="mr-2" />
                Resource Conflicts Detected ({conflicts.length})
              </span>
              <Button size="small" type="link">View All</Button>
            </div>
          }
          type="warning"
          showIcon={false}
          className="mb-4"
        />
      ) : null}
      
      <List
        size="small"
        dataSource={conflicts.slice(0, 2)} // Show only 2 most critical
        renderItem={conflict => (
          <List.Item>
            <div className="w-full">
              <div className="flex items-center mb-1">
                {getConflictIcon(conflict.type)}
                <span className="font-medium">{conflict.message}</span>
                <Tag 
                  color={conflict.severity === 'high' ? 'red' : 'orange'} 
                  className="ml-2"
                >
                  {conflict.severity} priority
                </Tag>
              </div>
              <div className="flex flex-wrap gap-1 ml-6">
                {conflict.resources.map(resource => (
                  <Tag key={resource}>{resource}</Tag>
                ))}
                <Button size="small" type="link" className="ml-auto">Resolve</Button>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ResourceConflictAlert;