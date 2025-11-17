// src/components/staff/layout/HeaderComponents/MobileHeaderMenu.js
import React from 'react';
import { Drawer, List, Avatar, Badge, Divider, Typography, Space } from 'antd';
import {
  UserOutlined,
  SwapOutlined,
  VideoCameraOutlined,
  MessageOutlined,
  BellOutlined,
  CloseOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { logout } from "../../../../redux/slice/authSlice";
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const MobileHeaderMenu = ({ 
  visible, 
  onClose, 
  currentDepartment, 
  user, 
  onDepartmentClick 
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    onClose();
  };

  const menuItems = [
    {
      key: 'department',
      icon: <SwapOutlined />,
      label: 'Switch Department',
      description: currentDepartment?.name || 'No department selected',
      onClick: onDepartmentClick,
      badge: null
    },
    {
      key: 'video',
      icon: <VideoCameraOutlined />,
      label: 'Video Calls',
      description: 'Start or join video consultations',
      onClick: () => {
        // Handle video calls
        onClose();
      },
      badge: null
    },
    {
      key: 'messages',
      icon: <MessageOutlined />,
      label: 'Messages',
      description: 'Chat with patients and staff',
      onClick: () => {
        // Handle messages
        onClose();
      },
      badge: 3
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: 'Notifications',
      description: 'View your notifications',
      onClick: () => {
        // Handle notifications
        onClose();
      },
      badge: 5
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile Settings',
      description: 'Manage your account',
      onClick: () => {
        navigate('/staff/profile');
        onClose();
      },
      badge: null
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <Title level={5} className="!mb-0">Menu</Title>
          <CloseOutlined onClick={onClose} className="text-gray-400 cursor-pointer" />
        </div>
      }
      placement="left"
      onClose={onClose}
      open={visible}
      width={320}
      bodyStyle={{ padding: 0 }}
    >
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar 
            size={48} 
            src={user?.avatar} 
            icon={<UserOutlined />}
            className="bg-blue-500"
          />
          <div className="flex-1 min-w-0">
            <Text strong className="text-gray-800 block truncate">
              {user?.first_name} {user?.last_name}
            </Text>
            <Text type="secondary" className="text-sm block truncate">
              {user?.role}
            </Text>
            <Text type="secondary" className="text-xs block">
              {user?.institution?.name}
            </Text>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <List
        dataSource={menuItems}
        renderItem={(item) => (
          <List.Item
            className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-0"
            onClick={item.onClick}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <Text className="text-gray-800 text-sm font-medium">
                    {item.label}
                  </Text>
                  <Text type="secondary" className="text-xs">
                    {item.description}
                  </Text>
                </div>
              </div>
              {item.badge && (
                <Badge count={item.badge} size="small" />
              )}
            </div>
          </List.Item>
        )}
      />

      <Divider className="my-2" />

      {/* Footer Actions */}
      <div className="p-4 space-y-2">
        <List.Item
          className="px-0 cursor-pointer hover:bg-gray-50 rounded transition-colors border-0"
          onClick={() => {
            navigate('/staff/settings');
            onClose();
          }}
        >
          <Space>
            <SettingOutlined className="text-gray-600" />
            <Text className="text-gray-700">Settings</Text>
          </Space>
        </List.Item>
        
        <List.Item
          className="px-0 cursor-pointer hover:bg-gray-50 rounded transition-colors border-0"
          onClick={handleLogout}
        >
          <Space>
            <LogoutOutlined className="text-red-600" />
            <Text className="text-red-600">Logout</Text>
          </Space>
        </List.Item>
      </div>
    </Drawer>
  );
};

export default MobileHeaderMenu;