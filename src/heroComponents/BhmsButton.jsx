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
  // Color configurations
  const colorConfig = {
    primary: {
      bg: "#19417D",
      hoverBg: "#143265",
      text: "#FFFFFF",
      border: "#19417D"
    },
    secondary: {
      bg: "#00DFA2",
      hoverBg: "#00C78E",
      text: "#FFFFFF",
      border: "#00DFA2"
    },
    accent: {
      bg: "#FF6B6B",
      hoverBg: "#E55A5A",
      text: "#FFFFFF",
      border: "#FF6B6B"
    },
    outline: {
      bg: "transparent",
      hoverBg: "#19417D10", // 10% opacity
      text: "#19417D",
      border: "#19417D"
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