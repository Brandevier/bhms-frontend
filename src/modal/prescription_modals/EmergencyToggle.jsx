import React from 'react';
import { Switch, Alert } from 'antd';

const EmergencyToggle = ({ isEmergency, onChange }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
      <div className="flex items-center">
        <span className="font-medium mr-3">Emergency Prescription:</span>
        <Switch
          checked={isEmergency}
          onChange={onChange}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
      </div>
      {isEmergency && (
        <Alert
          message="This prescription will be prioritized"
          type="error"
          showIcon
          size="small"
        />
      )}
    </div>
  );
};

export default EmergencyToggle;