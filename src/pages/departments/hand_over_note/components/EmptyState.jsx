import React from 'react';
import { Empty, Button, Typography } from 'antd';
import { TeamOutlined, FileAddOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const EmptyState = ({ onAddHandover }) => {
  return (
    <div className="text-center py-16 px-4">
      <Empty
        image={
          <div className="mb-4">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
              <TeamOutlined className="text-4xl text-blue-500" />
            </div>
          </div>
        }
        description={
          <div className="space-y-3">
            <Title level={4} className="text-gray-600 m-0">
              No Handover Notes Yet
            </Title>
            <Text type="secondary" className="text-lg">
              Start creating handover notes to ensure smooth patient care transitions between shifts
            </Text>
          </div>
        }
      >
        <Button
          type="primary"
          size="large"
          icon={<FileAddOutlined />}
          onClick={onAddHandover}
          className="bg-gradient-to-r from-blue-500 to-purple-500 border-0 hover:from-blue-600 hover:to-purple-600 h-12 px-8 rounded-xl font-semibold"
        >
          Create First Handover
        </Button>
      </Empty>
    </div>
  );
};

export default EmptyState;