// components/EyeIconButton.jsx
import React from 'react';
import { Button, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const EyeIconButton = ({ onClick, title = "View Details" }) => {
  return (
    <Tooltip title={title}>
      <Button
        type="text"
        icon={<EyeOutlined />}
        onClick={onClick}
        size="small"
        style={{ color: '#52c41a' }}
      />
    </Tooltip>
  );
};

export default EyeIconButton;