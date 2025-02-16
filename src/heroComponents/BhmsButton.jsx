import React from "react";
import { Button } from "antd";

const BhmsButton = ({
  children,
  onClick,
  icon,
  width = "auto",
  // height="auto",
  size = "large",
  color = "#19417D", // Default primary color
  className = "",
  borderRadius = "8px",
  block = true, // Makes button full width by default
  disabled = false,
  htmlType = "button", // Default type is "button", can be changed to "submit"
  outline = false, // New prop for outline mode
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      icon={icon}
      className={`font-semibold transition-all duration-300 ${className}`}
      style={{
        backgroundColor: outline ? "transparent" : color, // Transparent background for outline
        borderColor: color,
        color: outline ? color : "#fff", // Text color matches border for outline
        borderRadius: borderRadius,
        width: block ? "100%" : width,
        // height: block ? "100%" : height,
      }}
      size={size}
      htmlType={htmlType} // Allows form submission when used inside a form
    >
      {children}
    </Button>
  );
};

export default BhmsButton;
