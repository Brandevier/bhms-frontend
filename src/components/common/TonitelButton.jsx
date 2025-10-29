// src/components/common/TonitelButton.jsx
import React from 'react';
import { Button } from 'antd';

const TonitelButton = ({
  children,
  icon,
  onClick,
  type = "primary",
  size = "md", // sm | md | lg
  style = {},
  ...props
}) => {
  // Define brand colors from the logo
  const brandGradient = 'linear-gradient(135deg, #00E1AD 0%, #00B68A 100%)';
  const hoverGradient = 'linear-gradient(135deg, #00B68A 0%, #009E7D 100%)';

  // Define size options
  const sizeStyles = {
    sm: { fontSize: 12, padding: '4px 12px', borderRadius: 6 },
    md: { fontSize: 14, padding: '6px 16px', borderRadius: 8 },
    lg: { fontSize: 16, padding: '8px 20px', borderRadius: 10 },
  };

  return (
    <Button
      type={type}
      icon={icon}
      onClick={onClick}
      {...props}
      style={{
        background: brandGradient,
        border: 'none',
        color: '#fff',
        fontWeight: 500,
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0, 225, 173, 0.4)',
        ...sizeStyles[size],
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hoverGradient;
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = brandGradient;
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
    </Button>
  );
};

export default TonitelButton;
