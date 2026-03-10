// components/MessagesArea.jsx
import React, { useMemo } from 'react';
import { Spin, Typography, Avatar, Divider } from 'antd';
import { CheckOutlined, LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

const MessagesArea = ({ messages, currentUser, loading, messagesEndRef }) => {
  const groupedMessages = useMemo(() => {
    const groups = {};
    messages.forEach(message => {
      if (!message) return;
      const date = moment(message.createdAt).format('YYYY-MM-DD');
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  }, [messages]);

  const sortedDates = Object.keys(groupedMessages).sort((a, b) => moment(a).diff(moment(b)));

  const renderMessageStatus = (msg) => {
    switch (msg.status) {
      case 'sending':
        return <LoadingOutlined className="text-gray-400 ml-2" />;
      case 'delivered':
        return <CheckOutlined className="text-blue-500 ml-2" />;
      case 'failed':
        return <CloseOutlined className="text-red-500 ml-2" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Text type="secondary" className="text-gray-500">
          No messages yet. Start a conversation!
        </Text>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      {sortedDates.map((date) => (
        <div key={date} className="mb-6">
          <Divider orientation="center" className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full ">
            {moment(date).calendar()}
          </Divider>
          
          {groupedMessages[date].map((msg) => {
            if (!msg) return null;

            const isSender = msg.senderId === currentUser?.id || msg.senderAdminId === currentUser?.id;
            const fromAdmin = !!msg.senderAdminId;
            const senderName = msg.SenderAdmin?.username ||
              `${msg?.Sender?.firstName} ${msg?.Sender?.lastName}` ||
              'Unknown';

            return (
              <div
                key={msg.id || msg.tempId}
                className={`mb-2 flex ${isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[65%] rounded-lg px-4 py-2 shadow-sm ${
                  isSender
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}>
                  
                  {!isSender && (
                    <div className="flex items-center mb-1">
                      <Avatar
                        size={30}
                        src={msg.Sender?.avatar || msg.SenderAdmin?.avatar}
                        className="mr-2"
                      >
                        {senderName?.charAt(0)}
                      </Avatar>
                      <Text strong className={`text-sm ${fromAdmin ? 'text-blue-600' : 'text-gray-800'}`}>
                        {senderName}
                      </Text>
                      {fromAdmin && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap break-words text-sm">
                    {msg.text}
                  </div>
                  
                  <div className={`flex items-center justify-end mt-1 text-xs ${
                    isSender ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {moment(msg.createdAt).format('h:mm A')}
                    {isSender && renderMessageStatus(msg)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesArea;