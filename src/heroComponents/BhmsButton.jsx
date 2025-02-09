import React from "react";
import { Button } from "antd";

const BhmsButton = ({
  children,
  onClick,
  size = "large",
  color = "#19417D", // Default primary color
  className = "",
  borderRadius = "8px",
  block = true, // Makes button long by default
  disabled = false,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`font-semibold transition-all duration-300 ${className}`}
      style={{
        backgroundColor: color,
        borderColor: color,
        color: "#fff",
        borderRadius: borderRadius,
        width: block ? "100%" : "auto",
      }}
      size={size}
    >
      {children}
    </Button>
  );
};

export default BhmsButton;
