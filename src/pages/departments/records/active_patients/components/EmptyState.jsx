import React from 'react';
import { Empty, Button, Typography,Card } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const EmptyState = ({ searchTerm, onClearSearch }) => {
  return (
    <Card className="border-0 shadow-sm rounded-xl bg-white">
      <div className="py-12">
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
                {searchTerm ? 'No Patients Found' : 'No Patients Available'}
              </Title>
              <Text type="secondary" className="text-base">
                {searchTerm 
                  ? 'No patients match your search criteria. Try different keywords.'
                  : 'There are no patients in the system yet.'
                }
              </Text>
            </div>
          }
        >
          {searchTerm && (
            <Button
              type="primary"
              onClick={onClearSearch}
              className="mt-4 bg-blue-500 border-blue-500 hover:bg-blue-600"
            >
              Clear Search
            </Button>
          )}
        </Empty>
      </div>
    </Card>
  );
};

export default EmptyState;