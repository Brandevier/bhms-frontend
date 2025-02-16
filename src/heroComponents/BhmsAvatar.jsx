import React from "react";
import { Avatar } from "antd";

const BhmsAvatar = ({
  icon,
  size = 28,
  color = "#19417D", // Default primary color
  hoverColor = "#1560BD", // Slightly lighter hover color
  outline = false, // Outline mode
  onClick,
  style = {},
  className = "",
}) => {
  return (
    <Avatar
      size={size}
      icon={icon}
      style={{
        backgroundColor: outline ? "transparent" : color,
        border: `2px solid ${color}`,
        color: outline ? color : "#fff",
        cursor: "pointer",
        transition: "all 0.3s ease",
        ...style,
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = outline ? "transparent" : hoverColor;
        e.target.style.borderColor = hoverColor;
        e.target.style.color = outline ? hoverColor : "#fff";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = outline ? "transparent" : color;
        e.target.style.borderColor = color;
        e.target.style.color = outline ? color : "#fff";
      }}
    />
  );
};

export default BhmsAvatar;
