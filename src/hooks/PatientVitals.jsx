import React, { useState } from "react";
import { Card, Row, Col, Typography, Button, Checkbox, Tooltip } from "antd";
import { 
  HeartOutlined, 
  DashboardOutlined, 
  FireOutlined, 
  CloudOutlined, 
  SmileOutlined, 
  LineHeightOutlined, 
  ReloadOutlined,
  CalendarOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import moment from "moment";

const { Title, Text } = Typography;

// Define normal ranges for each vital sign
const normalRanges = {
  heart_rate: { min: 60, max: 100 }, // bpm
  pulse: { min: 60, max: 100 }, // bpm
  temperature: { min: 36.1, max: 37.2 }, // °C
  oxygen: { min: 95, max: 100 }, // %
  SpO2: { min: 95, max: 100 }, // %
  weight: { min: 30, max: 150 }, // kg (adjust based on patient category)
  pain: { min: 1, max: 3 }, // Pain level (1-3 is mild, above is concerning)
  rbs: { min: 70, max: 140 }, // mg/dL
  systole: { min: 90, max: 120 }, // mmHg
  diastole: { min: 60, max: 80 }, // mmHg
};

const PatientVitals = ({ vitals }) => {
  const [retakeRequired, setRetakeRequired] = useState(false);

  // Get latest vitals record
  const latestVitals = vitals && vitals.length > 0 ? vitals[0] : null;

  return (
    <Card 
      title="Vital Signs" 
      bordered={true} 
      extra={
        latestVitals ? (
          <Text type="secondary">
            <CalendarOutlined /> {moment(latestVitals.updatedAt).format("MMM DD, YYYY")}
          </Text>
        ) : null
      }
      style={{ marginBottom: 20 }}
    >
      <Row gutter={[8, 8]} justify="center">
        {latestVitals ? (
          [
            { key: "heart_rate", icon: <HeartOutlined />, label: "Heart Rate", unit: "bpm" },
            { key: "pulse", icon: <DashboardOutlined />, label: "Pulse", unit: "bpm" },
            { key: "temperature", icon: <FireOutlined />, label: "Temperature", unit: "°C" },
            { key: "oxygen", icon: <CloudOutlined />, label: "Oxygen Level", unit: "%" },
            { key: "SpO2", icon: <DashboardOutlined />, label: "SpO2", unit: "%" },
            { key: "weight", icon: <LineHeightOutlined />, label: "Weight", unit: "kg" },
            { key: "pain", icon: <SmileOutlined />, label: "Pain Level", unit: "" },
            { key: "rbs", icon: <DashboardOutlined />, label: "RBS", unit: "mg/dL" },
            { key: "systole", icon: <DashboardOutlined />, label: "Systole", unit: "mmHg" },
            { key: "diastole", icon: <DashboardOutlined />, label: "Diastole", unit: "mmHg" },
          ].map(({ key, icon, label, unit }) => {
            const value = latestVitals[key];
            if (value === undefined || value === null) return null;

            const isAbnormal = value < normalRanges[key].min || value > normalRanges[key].max;
            
            return (
              <Col key={key} xs={12} sm={12} md={6} lg={6}>
                <Card
                  bordered={false}
                  style={{ 
                    background: isAbnormal ? "#FFCCCC" : "#E6F7FF", // Red if abnormal, light blue if normal
                    padding: "8px", 
                    textAlign: "center", 
                    minHeight: "30px",
                    position: "relative"
                  }}
                >
                  {icon} 
                  <Text type="secondary" style={{ display: "block", fontSize: "12px" }}>
                    {label}
                  </Text>
                  <Title level={5} style={{ margin: 0 }}>
                    {value} {unit}
                  </Title>

                  {/* Show tooltip only when value is abnormal */}
                  {isAbnormal && (
                    <Tooltip title={`${label} is out of normal range (${normalRanges[key].min}-${normalRanges[key].max} ${unit})`}>
                      <InfoCircleOutlined style={{ color: "red", position: "absolute", top: 5, right: 10 }} />
                    </Tooltip>
                  )}
                </Card> 
              </Col>
            );
          })
        ) : (
          <Col span={24} style={{ textAlign: "center" }}>
            <Text type="secondary">No vital signs recorded.</Text>
          </Col>
        )}
      </Row>

      {/* Retake Checkbox & View More */}
      <Row justify="space-between" align="middle" style={{ marginTop: 15 }}>
        <Col>
          <Checkbox checked={retakeRequired} onChange={() => setRetakeRequired(!retakeRequired)}>
            <ReloadOutlined /> Mark vitals for retake
          </Checkbox>
        </Col>
        <Col>
          <Button size="small" type="primary">View More</Button>
        </Col>
      </Row>
    </Card>
  );
};

export default PatientVitals;
