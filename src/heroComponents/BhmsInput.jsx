import React from "react";
import { Input, Form } from "antd";

const BhmsInput = ({
  label,
  name,
  type = "text",
  size = "large",
  placeholder = "",
  prefix = null,
  suffix = null,
  disabled = false,
  required = false,
  rules = [],
  className = "",
  style = {},
  value = undefined,  // New value prop
  onChange = () => {}, // New onChange handler
}) => {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={required ? [{ required: true, message: `${label || ''} is required` }, ...rules] : rules}
      style={{ width: "100%", ...style }}
    >
      <Input
        type={type}
        size={size}
        placeholder={placeholder}
        prefix={prefix}
        suffix={suffix}
        disabled={disabled}
        className={className}
        value={value}  // Controlled Input
        onChange={onChange} // Handle Input Change
      />
    </Form.Item>
  );
};

export default BhmsInput;
