import React from 'react';
import { Progress, Tooltip } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const StockLevelIndicator = ({ current, threshold }) => {
  const percentage = (current / (threshold * 1.5)) * 100;
  let status = 'normal';
  let color = '#52c41a';
  
  if (current <= threshold) {
    status = 'exception';
    color = '#f5222d';
  } else if (current <= threshold * 1.2) {
    status = 'active';
    color = '#faad14';
  }

  return (
    <div className="stock-level-indicator">
      <Tooltip title={`${current} units available (threshold: ${threshold})`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress 
            percent={percentage} 
            status={status} 
            showInfo={false} 
            strokeColor={color}
            style={{ width: 100 }}
          />
          <span>{current}</span>
          {current <= threshold && <WarningOutlined style={{ color }} />}
        </div>
      </Tooltip>
    </div>
  );
};

export default StockLevelIndicator;