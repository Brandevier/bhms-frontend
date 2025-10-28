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
          background: 'linear-gradient(135deg, #00E1AD 0%, #00B68A 100%)',
          border: 'none',
          borderRadius: '10px',
          fontWeight: '600',
          color: '#fff',
          boxShadow: '0 4px 10px rgba(0, 225, 173, 0.4)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 225, 173, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 225, 173, 0.4)';
        }}
      >
        Video Call
      </Button>
    </Badge>
  );
};

export default VideoCallButton;
