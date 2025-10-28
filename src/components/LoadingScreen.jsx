import React, { useState, useEffect } from 'react';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

const LoadingScreen = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      {/* Your Logo - Replace with your actual logo */}
      <div
        style={{
          width: 120,
          height: 120,
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img 
          src="/assets/logo_2.png" // Replace with your logo path
          alt="Logo" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain' 
          }}
          onError={(e) => {
            // Fallback if logo doesn't exist
            e.target.style.display = 'none';
          }}
        />
        {/* Fallback if no logo */}
        
      </div>

      {/* Loading Spin */}
      <Spin 
        indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
        style={{ marginBottom: 16 }}
      />

      {/* Loading Text */}
      <Text style={{ fontSize: 16, color: '#666' }}>
        Loading your experience...
      </Text>

      {/* Optional: Progress bar */}
      <div
        style={{
          width: 200,
          height: 4,
          backgroundColor: '#f0f0f0',
          borderRadius: 2,
          marginTop: 16,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#1890ff',
            animation: 'progress 5s linear forwards',
          }}
        />
      </div>

      <style>
        {`
          @keyframes progress {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingScreen;