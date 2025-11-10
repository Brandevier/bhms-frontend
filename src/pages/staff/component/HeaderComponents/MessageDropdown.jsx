// src/components/staff/layout/HeaderComponents/MessageDropdown.js
import React, { useState, useEffect } from 'react';
import { Dropdown, Badge, List, Button, Avatar, Tag, message } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';

const MessageDropdown = () => {
  const [messages, setMessages] = useState([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  // Mock message data - will be replaced with backend later
  useEffect(() => {
    const mockMessages = [
      // {
      //   id: 1,
      //   sender: "Dr. Smith",
      //   senderAvatar: "https://example.com/avatar1.jpg",
      //   content: "Please review the patient case files for tomorrow's meeting.",
      //   timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      //   isRead: false,
      //   type: "direct"
      // },
      // {
      //   id: 2,
      //   sender: "Nursing Team",
      //   senderAvatar: "https://example.com/avatar2.jpg",
      //   content: "Shift change reminder: Please complete your handover notes.",
      //   timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      //   isRead: false,
      //   type: "group"
      // },
      // {
      //   id: 3,
      //   sender: "Admin",
      //   senderAvatar: "https://example.com/avatar3.jpg",
      //   content: "Your quarterly performance review is scheduled for next week.",
      //   timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      //   isRead: true,
      //   type: "announcement"
      // }
    ];

    setMessages(mockMessages);
    setUnreadMessageCount(mockMessages.filter(msg => !msg.isRead).length);
  }, []);

  const handleMarkAsRead = (messageId) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
    setUnreadMessageCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
    setUnreadMessageCount(0);
    message.success("All messages marked as read");
  };

  const handleViewAllMessages = () => {
    message.info("Messages feature will be fully implemented with backend");
  };

  const messageMenu = (
    <div className="w-80 bg-white shadow-lg rounded-lg">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Messages</h3>
          {unreadMessageCount > 0 && (
            <Button 
              type="link" 
              size="small" 
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {messages.length > 0 ? (
          <List
            dataSource={messages.slice(0, 5)}
            renderItem={(msg) => (
              <List.Item
                key={msg.id}
                className={`p-3 cursor-pointer border-b hover:bg-gray-50 ${
                  !msg.isRead ? "bg-blue-50" : ""
                }`}
                onClick={() => handleMarkAsRead(msg.id)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      src={msg.senderAvatar} 
                      icon={<UserOutlined />}
                      size="small"
                    />
                  }
                  title={
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm">{msg.sender}</span>
                      <span className="text-xs text-gray-500">
                        {moment(msg.timestamp).fromNow()}
                      </span>
                    </div>
                  }
                  description={
                    <div>
                      <p className="text-xs text-gray-600 truncate">
                        {msg.content}
                      </p>
                      <Tag 
                        color={
                          msg.type === 'direct' ? 'blue' : 
                          msg.type === 'group' ? 'green' : 'orange'
                        } 
                        size="small"
                        className="mt-1"
                      >
                        {msg.type}
                      </Tag>
                    </div>
                  }
                />
                {!msg.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                )}
              </List.Item>
            )}
          />
        ) : (
          <div className="p-4 text-center text-gray-500">
            <MessageOutlined className="text-2xl mb-2 text-gray-300" />
            <p>No messages</p>
          </div>
        )}
      </div>

      <div className="p-3 border-t">
        <Button 
          type="link" 
          className="w-full text-center text-blue-500"
          onClick={handleViewAllMessages}
        >
          View All Messages
        </Button>
      </div>
    </div>
  );

  return (
    <Dropdown overlay={messageMenu} trigger={["click"]} placement="bottomRight">
      <Badge count={unreadMessageCount} overflowCount={9} size="small">
        <div className="p-2 cursor-pointer text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
          <MessageOutlined className="text-xl" />
        </div>
      </Badge>
    </Dropdown>
  );
};

export default MessageDropdown;