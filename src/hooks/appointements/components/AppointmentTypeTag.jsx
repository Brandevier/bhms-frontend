import React from 'react';
import { Tag } from 'antd';

const AppointmentTypeTag = ({ type }) => {
  const typeConfig = {
    'routine': { color: 'blue', text: 'Routine Check', icon: '🩺' },
    'checkup': { color: 'green', text: 'Medical Checkup', icon: '❤️' },
    'follow-up': { color: 'purple', text: 'Follow-up', icon: '📋' },
    'emergency': { color: 'red', text: 'Emergency', icon: '🚨' },
    'consultation': { color: 'orange', text: 'Consultation', icon: '💬' },
    'surgery': { color: 'volcano', text: 'Surgery', icon: '🔪' },
    'therapy': { color: 'cyan', text: 'Therapy', icon: '🧠' },
    'vaccination': { color: 'lime', text: 'Vaccination', icon: '💉' }
  };
  
  const config = typeConfig[type?.toLowerCase()] || { 
    color: 'default', 
    text: type || 'Appointment',
    icon: '📅'
  };

  return (
    <Tag 
      color={config.color} 
      style={{ 
        borderRadius: 12, 
        padding: '2px 8px',
        margin: 0,
        fontSize: '12px',
        fontWeight: 500
      }}
    >
      {config.icon} {config.text}
    </Tag>
  );
};

export default AppointmentTypeTag;