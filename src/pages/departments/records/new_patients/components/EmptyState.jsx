import React from 'react';
import { Empty, Button, Typography } from 'antd';
import { UserAddOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const EmptyState = ({ onRegisterPatient }) => {
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
              No Patients Found
            </Title>
            <Text type="secondary" className="text-base">
              Start by registering new patients to build your medical records system
            </Text>
          </div>
        }
      >
        <Button
          type="primary"
          size="large"
          icon={<UserAddOutlined />}
          onClick={onRegisterPatient}
          className="bg-gradient-to-r from-blue-500 to-purple-500 border-0 hover:from-blue-600 hover:to-purple-600 h-12 px-8 rounded-xl font-semibold"
        >
          Register First Patient
        </Button>
      </Empty>
    </div>
  );
};

export default EmptyState;