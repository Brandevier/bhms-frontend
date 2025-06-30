import React from "react";
import { Button } from "antd";

const BhmsButton = ({
  children,
  onClick,
  icon,
  width = "auto",
  size = "large",
  variant = "primary", // 'primary' | 'secondary' | 'accent' | 'outline'
  className = "",
  borderRadius = "8px",
  block = false,
  disabled = false,
  htmlType = "button",
}) => {
 const colorConfig = {
  primary: {
    bg: "#00E5B0",           // Tonitel green
    hoverBg: "#00CDA0",      // Slightly darker for hover
    text: "#FFFFFF",
    border: "#00E5B0"
  },
  secondary: {
    bg: "#082135",           // A deep navy for contrast (optional secondary)
    hoverBg: "#061B2C",
    text: "#FFFFFF",
    border: "#082135"
  },
  accent: {
    bg: "#FF6B6B",
    hoverBg: "#E55A5A",
    text: "#FFFFFF",
    border: "#FF6B6B"
  },
  outline: {
    bg: "transparent",
    hoverBg: "#00E5B020",    // 20% opacity Tonitel green
    text: "#00E5B0",
    border: "#00E5B0"
  }
};


  const currentColor = colorConfig[variant] || colorConfig.primary;

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      icon={icon}
      className={`font-semibold transition-all duration-300 hover:shadow-md ${className}`}
      style={{
        backgroundColor: currentColor.bg,
        borderColor: currentColor.border,
        color: currentColor.text,
        borderRadius: borderRadius,
        width: block ? "100%" : width,
        // Hover styles
        '&:hover': {
          backgroundColor: currentColor.hoverBg,
          borderColor: currentColor.hoverBg,
          color: variant === 'outline' ? currentColor.text : '#FFFFFF'
        },
        '&:active': {
          backgroundColor: currentColor.hoverBg,
          borderColor: currentColor.hoverBg
        },
        '&:focus': {
          backgroundColor: currentColor.bg,
          borderColor: currentColor.border
        }
      }}
      size={size}
      htmlType={htmlType}
    >
      {children}
    </Button>
  );
};

export default BhmsButton;