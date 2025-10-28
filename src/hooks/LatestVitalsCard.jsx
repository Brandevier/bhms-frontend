import React from 'react';
import { Card, Tag, Typography } from 'antd';

const { Text } = Typography;

const vitalColors = {
  bloodPressure: 'red',
  temperature: 'orange',
  pulse: 'green',
  oxygen: 'purple',
  weight: 'blue',
  height: 'cyan',
  respiratory: 'geekblue',
  glucose: 'gold'
};

const LatestVitalsCard = ({ vitalSignsRecords }) => {
  // Safely get the latest vitals record
  const latestVitals = Array.isArray(vitalSignsRecords) && vitalSignsRecords?.length > 0 
    ? vitalSignsRecords?.[0] 
    : null;

  if (!latestVitals || typeof latestVitals !== 'object' || Object.keys(latestVitals).length === 0) {
    return null;
  }

  // Helper function to check if a value exists and is a valid number
  const isValidNumber = (value) => {
    return value !== null && value !== undefined && !isNaN(value);
  };

  return (
    <Card 
      title="Latest Vitals" 
      style={{ marginBottom: 16 }}
      bodyStyle={{ padding: 12 }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {/* Blood Pressure */}
        {isValidNumber(latestVitals?.systole) && isValidNumber(latestVitals?.diastole) && (
          <div>
            <Text strong>BP:</Text>
            <Tag color={vitalColors?.bloodPressure} style={{ marginLeft: 8 }}>
              {`${latestVitals.systole}/${latestVitals.diastole} mmHg`}
            </Tag>
          </div>
        )}

        {/* Temperature */}
        {isValidNumber(latestVitals?.temperature) && (
          <div>
            <Text strong>Temp:</Text>
            <Tag color={vitalColors?.temperature} style={{ marginLeft: 8 }}>
              {`${latestVitals.temperature}°C`}
            </Tag>
          </div>
        )}

        {/* Pulse */}
        {isValidNumber(latestVitals?.pulse) && (
          <div>
            <Text strong>Pulse:</Text>
            <Tag color={vitalColors?.pulse} style={{ marginLeft: 8 }}>
              {`${latestVitals.pulse} bpm`}
            </Tag>
          </div>
        )}

        {/* Oxygen Saturation */}
        {isValidNumber(latestVitals?.SpO2) && (
          <div>
            <Text strong>SpO₂:</Text>
            <Tag color={vitalColors?.oxygen} style={{ marginLeft: 8 }}>
              {`${latestVitals?.SpO2}%`}
            </Tag>
          </div>
        )}

        {/* Weight */}
        {isValidNumber(latestVitals?.weight) && (
          <div>
            <Text strong>Weight:</Text>
            <Tag color={vitalColors?.weight} style={{ marginLeft: 8 }}>
              {`${latestVitals?.weight} kg`}
            </Tag>
          </div>
        )}

        {/* Height */}
        {isValidNumber(latestVitals?.height) && (
          <div>
            <Text strong>Height:</Text>
            <Tag color={vitalColors?.height} style={{ marginLeft: 8 }}>
              {`${latestVitals?.height} cm`}
            </Tag>
          </div>
        )}

        {/* Respiratory Rate */}
        {isValidNumber(latestVitals?.respiratory_rate) && (
          <div>
            <Text strong>Resp Rate:</Text>
            <Tag color={vitalColors?.respiratory} style={{ marginLeft: 8 }}>
              {`${latestVitals?.respiratory_rate} rpm`}
            </Tag>
          </div>
        )}

        {/* Blood Glucose */}
        {isValidNumber(latestVitals?.rbs) && (
          <div>
            <Text strong>Glucose:</Text>
            <Tag color={vitalColors?.glucose} style={{ marginLeft: 8 }}>
              {`${latestVitals?.rbs} mg/dL`}
            </Tag>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LatestVitalsCard;