import React from "react";
import { Card, Typography, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import VitalStatusIndicator from "./VitalStatusIndicator";
import { vitalConfig } from "./vitalConfig";

const { Title, Text } = Typography;

const VitalCard = ({ vitalKey, vitals }) => {
  const config = vitalConfig[vitalKey];
  if (!config) return null;

  let value;
  let displayValue;
  
  if (Array.isArray(config.field)) {
    // For composite fields like blood pressure
    value = config.format(vitals);
    displayValue = value;
  } else {
    value = vitals?.[config.field];
    displayValue = value !== null && value !== undefined ? value : "N/A";
  }

  const getStatusColor = () => {
    if (value === null || value === undefined) return "#bfbfbf";
    
    if (vitalKey === "blood_pressure") {
      const systolic = vitals?.systole;
      if (systolic === null || systolic === undefined) return "#bfbfbf";
      
      if (systolic < config.ranges.normal.min || systolic > config.ranges.normal.max) {
        return systolic < config.ranges.warning.min || systolic > config.ranges.warning.max 
          ? config.ranges.danger.color 
          : config.ranges.warning.color;
      }
      return config.ranges.normal.color;
    }
    
    const numericValue = parseFloat(value);
    if (numericValue < config.ranges.normal.min || numericValue > config.ranges.normal.max) {
      return numericValue < config.ranges.warning.min || numericValue > config.ranges.warning.max 
        ? config.ranges.danger.color 
        : config.ranges.warning.color;
    }
    return config.ranges.normal.color;
  };

  const color = getStatusColor();

  return (
    <Card
      bordered={false}
      style={{ 
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        textAlign: "center",
        height: "100%",
        background: displayValue === "N/A" ? "#f5f5f5" : "#fff"
      }}
      bodyStyle={{ padding: "12px" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ marginRight: 8, fontSize: 20, color }}>
          {displayValue === "N/A" ? (
            <Tooltip title="Data not available">
              <QuestionCircleOutlined style={{ color: "#bfbfbf" }} />
            </Tooltip>
          ) : (
            React.cloneElement(config.icon, { style: { color } })
          )}
        </div>
        <div>
          <Text strong style={{ display: "block", color: "#595959", fontSize: "12px" }}>
            {config.label}
          </Text>
          <Title 
            level={4} 
            style={{ 
              margin: 0,
              color,
              fontWeight: 600,
              fontSize: "16px"
            }}
          >
            {displayValue}
            {displayValue !== "N/A" && (
              <small style={{ fontSize: "10px", color: "#8c8c8c", marginLeft: "4px" }}>
                {config.unit}
              </small>
            )}
          </Title>
        </div>
        
        {displayValue !== "N/A" && (
          <VitalStatusIndicator 
            vitalKey={vitalKey} 
            value={value} 
            config={config} 
          />
        )}
      </div>
    </Card>
  );
};

export default VitalCard;