import React from 'react';
import { Card, List, Tag, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const { Text } = Typography;

const RedFlagsTab = ({ data }) => {
  const redFlags = [
    {
      type: 'Ending Soon',
      description: 'Prescriptions nearing expiration',
      count: data.ending_soon || 0,
      severity: 'medium'
    },
    {
      type: 'High Quantity',
      description: 'Prescriptions with unusually high quantities',
      count: data.core?.total_quantity > 50 ? 1 : 0,
      severity: 'low'
    },
    {
      type: 'Emergency Cases',
      description: 'High number of emergency prescriptions',
      count: data.core?.emergency || 0,
      severity: data.core?.emergency > 1 ? 'high' : 'low'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'yellow';
      default: return 'blue';
    }
  };

  return (
    <Card title="Potential Issues Requiring Review">
      <List
        dataSource={redFlags}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<WarningOutlined style={{ color: getSeverityColor(item.severity), fontSize: '20px' }} />}
              title={
                <span>
                  <Tag color={getSeverityColor(item.severity)}>{item.type}</Tag>
                  {item.count > 0 && <Tag>{item.count} cases</Tag>}
                </span>
              }
              description={item.description}
            />
          </List.Item>
        )}
      />
      
      {data.core?.canceled > 0 && (
        <div style={{ marginTop: 16 }}>
          <Text type="warning">
            <WarningOutlined /> {data.core.canceled} prescriptions were canceled and may require review.
          </Text>
        </div>
      )}
    </Card>
  );
};

export default RedFlagsTab;