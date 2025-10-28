// src/components/staff/video/VideoCallButton.js
import React from 'react';
import { Button, Badge } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';

const VideoCallButton = ({ onClick, pendingCalls = 0 }) => {
  return (
    <Badge count={pendingCalls} overflowCount={9} size="small">
      <Button
        type="primary"
        icon={<VideoCameraOutlined />}
        onClick={onClick}
        className="flex items-center gap-2"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '500',
        }}
      >
        Video Call
      </Button>
    </Badge>
  );
};

export default VideoCallButton;