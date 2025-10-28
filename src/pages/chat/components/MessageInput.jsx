// components/MessageInput.jsx
import React from 'react';
import { Input, Button, Tooltip } from 'antd';
import { SendOutlined, PaperClipOutlined, SmileOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const MessageInput = ({ chatInput, setChatInput, onSendMessage, isSending, disabled }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-end space-x-3">
        <Tooltip title="Attach file">
          <Button
            icon={<PaperClipOutlined />}
            type="text"
            className="text-gray-500 hover:text-blue-500 text-xl h-10 w-10 flex items-center justify-center"
            disabled={disabled}
          />
        </Tooltip>

        <Tooltip title="Emoji">
          <Button
            icon={<SmileOutlined />}
            type="text"
            className="text-gray-500 hover:text-blue-500 text-xl h-10 w-10 flex items-center justify-center"
            disabled={disabled}
          />
        </Tooltip>

        <div className="flex-1 border border-gray-300 rounded-lg hover:border-blue-400 focus-within:border-blue-400 transition-colors">
          <TextArea
            placeholder={disabled ? "Select a department to chat" : "Type a message"}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={handleKeyPress}
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="border-none text-gray-800 placeholder-gray-500 text-sm px-3 py-2 resize-none"
            disabled={disabled}
            style={{ border: 'none', boxShadow: 'none' }}
          />
        </div>

        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={onSendMessage}
          disabled={!chatInput.trim() || isSending || disabled}
          className="bg-blue-500 border-none hover:bg-blue-600 h-10 w-10 flex items-center justify-center"
          shape="circle"
          loading={isSending}
        />
      </div>
    </div>
  );
};

export default MessageInput;