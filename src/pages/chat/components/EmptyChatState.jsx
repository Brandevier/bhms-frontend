// components/EmptyChatState.jsx
import React from 'react';
import { Typography, Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const { Text } = Typography;

const EmptyChatState = ({ isMobile, onSelectDepartment }) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center p-6 max-w-md">
        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageOutlined className="text-3xl text-blue-500" />
        </div>
        
        <Text className="block text-gray-800 text-xl font-semibold mb-3">
          Department Chat
        </Text>
        
        <Text className="block text-gray-600 text-sm mb-6 leading-relaxed">
          {isMobile 
            ? "Select a department to start chatting with your team members."
            : "Select a department from the sidebar to start chatting with your team members."
          }
        </Text>
        
        {isMobile && (
          <Button
            type="primary"
            onClick={onSelectDepartment}
            size="large"
            className="bg-blue-500 border-none hover:bg-blue-600"
          >
            Select Department
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyChatState;