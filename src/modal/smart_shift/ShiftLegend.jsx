import React from 'react';
import { Badge, Space } from 'antd';

const ShiftLegend = () => {
  const shiftTypes = [
    { type: 'Morning', color: 'blue' },
    { type: 'Afternoon', color: 'orange' },
    { type: 'Night', color: 'purple' },
    { type: 'Off', color: 'green' }
  ];

  return (
    <div className="mt-6 flex justify-center">
      <Space size="large">
        {shiftTypes.map(({ type, color }) => (
          <div key={type} className="flex items-center">
            <Badge color={color} />
            <span className="ml-2">{type}</span>
          </div>
        ))}
      </Space>
    </div>
  );
};

export default ShiftLegend;