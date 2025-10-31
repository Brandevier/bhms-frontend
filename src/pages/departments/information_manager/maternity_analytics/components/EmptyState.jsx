// components/maternity/components/EmptyState.js
import React from 'react';
import { Card, Empty, Button, Typography } from 'antd';
import { ReloadOutlined, WomanOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const EmptyState = () => {
  return (
    <Card className="text-center py-16">
      <Empty
        image={<WomanOutlined className="text-6xl text-gray-300" />}
        description={
          <div>
            <Title level={4} className="text-gray-600">
              No Maternity Data Available
            </Title>
            <Text className="text-gray-500 block mb-4">
              There is no maternity analytics data to display at this time.
            </Text>
            <Text type="secondary">
              This could be because no deliveries, ANC visits, or PNC records have been recorded yet.
            </Text>
          </div>
        }
      >
        <Button type="primary" icon={<ReloadOutlined />}>
          Refresh Data
        </Button>
      </Empty>
    </Card>
  );
};

export default EmptyState;