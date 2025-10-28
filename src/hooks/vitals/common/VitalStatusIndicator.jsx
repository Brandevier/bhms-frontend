import React from "react";
import { Tooltip, Badge } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const VitalStatusIndicator = ({ vitalKey, value, config }) => {
  if (value === null || value === undefined || value === "N/A") {
    return null;
  }

  const getStatus = () => {
    if (vitalKey === "blood_pressure") {
      // For BP, we check systolic value
      const systolic = parseInt(value.split('/')[0]);
      if (systolic < config.ranges.normal.min || systolic > config.ranges.normal.max) {
        return systolic < config.ranges.warning.min || systolic > config.ranges.warning.max 
          ? "danger" 
          : "warning";
      }
      return "normal";
    }

    const numericValue = parseFloat(value);
    if (numericValue < config.ranges.normal.min || numericValue > config.ranges.normal.max) {
      return numericValue < config.ranges.warning.min || numericValue > config.ranges.warning.max 
        ? "danger" 
        : "warning";
    }
    return "normal";
  };

  const status = getStatus();
  if (status === "normal") return null;

  const getTooltipMessage = () => {
    const numericValue = vitalKey === "blood_pressure" 
      ? parseInt(value.split('/')[0]) 
      : parseFloat(value);
    
    if (status === "danger") {
      return `Critical: ${config.label} is ${numericValue}${config.unit} (Normal: ${config.ranges.normal.min}-${config.ranges.normal.max}${config.unit})`;
    }
    return `Warning: ${config.label} is ${numericValue}${config.unit} (Normal: ${config.ranges.normal.min}-${config.ranges.normal.max}${config.unit})`;
  };

  return (
    <Tooltip title={getTooltipMessage()}>
      <Badge
        dot
        color={status === "danger" ? "#ff4d4f" : "#faad14"}
        style={{ marginLeft: 8 }}
      >
        <ExclamationCircleOutlined 
          style={{ 
            color: status === "danger" ? "#ff4d4f" : "#faad14",
            fontSize: '14px'
          }} 
        />
      </Badge>
    </Tooltip>
  );
};

export default VitalStatusIndicator;