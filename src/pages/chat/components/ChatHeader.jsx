// components/ChatHeader.jsx
import React from 'react';
import { Typography, Button, Avatar } from 'antd';
import { MenuOutlined, MoreOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ChatHeader = ({ department, isMobile, onMenuClick, onAddUsers }) => {
  return (
    <div className="p-3 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        {isMobile && (
          <Button
            icon={<MenuOutlined />}
            onClick={onMenuClick}
            type="text"
            className="text-gray-600 hover:text-blue-500 mr-3"
          />
        )}
        
        <Avatar
          size={40}
          className="bg-blue-500 text-white mr-3"
        >
          {department.name?.charAt(0)?.toUpperCase() || 'D'}
        </Avatar>
        
        <div>
          <Text strong className="text-gray-800 block">
            {department.name}
          </Text>
          <Text className="text-gray-500 text-xs block">
            {department.departmentType || 'Department'} • Online
          </Text>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          icon={<MoreOutlined />}
          onClick={onAddUsers}
          type="text"
          className="text-gray-600 hover:text-blue-500"
        />
      </div>
    </div>
  );
};

export default ChatHeader;