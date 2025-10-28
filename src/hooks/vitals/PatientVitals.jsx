import React, { useState } from "react";
import { Card, Row, Col, Typography, Button, Empty, Collapse, Timeline, Tag, Divider } from "antd";
import { CalendarOutlined, ArrowRightOutlined, HistoryOutlined } from "@ant-design/icons";
import moment from "moment";
import VitalCard from "./common/VitalCard"; 
import { vitalConfig, primaryVitals, secondaryVitals } from "./common/vitalConfig";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const PatientVitals = ({ vitals }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState(null);

  // Sort vitals by date (newest first)
  const sortedVitals = [...(vitals || [])].sort((a, b) => 
    new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
  );

  const latestVitals = sortedVitals[0] || {};

  // Filter out vitals that have no data in the latest reading
  const hasVitalData = (vitalKey, vitalRecord = latestVitals) => {
    const config = vitalConfig[vitalKey];
    if (!config) return false;
    
    if (Array.isArray(config.field)) {
      return config.field.some(field => vitalRecord[field] !== null && vitalRecord[field] !== undefined);
    }
    
    return vitalRecord[config.field] !== null && vitalRecord[config.field] !== undefined;
  };

  const availablePrimaryVitals = primaryVitals.filter(key => hasVitalData(key));
  const availableSecondaryVitals = secondaryVitals.filter(key => hasVitalData(key));

  if (!vitals || vitals.length === 0) {
    return (
      <Card
        title="Vital Signs"
        bordered={false}
        style={{ 
          borderRadius: 8,
          boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
          marginBottom: 24
        }}
      >
        <Empty 
          description="No vital signs recorded" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: 16 }}
        />
      </Card>
    );
  }

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
          <span>Vital Signs</span>
          <Tag color="blue">
            <HistoryOutlined style={{ marginRight: 4 }} />
            {vitals.length} records
          </Tag>
        </div>
      }
      bordered={false}
      style={{ 
        borderRadius: 8,
        boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
        marginBottom: 24
      }}
      extra={
        <Button 
          type="text" 
          size="small"
          icon={<ArrowRightOutlined />}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide History" : "Show History"}
        </Button>
      }
    >
      {/* Current/Latest Vitals */}
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ display: 'block', marginBottom: 12, color: '#1890ff' }}>
          Latest Reading • {latestVitals?.createdAt ? moment(latestVitals.createdAt).format("MMM D, YYYY h:mm A") : 'No date'}
        </Text>
        
        <Row gutter={[8, 8]}>
          {availablePrimaryVitals.map(vitalKey => (
            <Col key={vitalKey} xs={24} sm={12} md={8} lg={6} style={{ padding: 4 }}>
              <VitalCard vitalKey={vitalKey} vitals={latestVitals} />
            </Col>
          ))}
          
          {expanded && availableSecondaryVitals.map(vitalKey => (
            <Col key={vitalKey} xs={24} sm={12} md={8} lg={6} style={{ padding: 4 }}>
              <VitalCard vitalKey={vitalKey} vitals={latestVitals} />
            </Col>
          ))}
        </Row>
      </div>

      {/* Vital Signs History */}
      {expanded && (
        <div>
          <Divider />
          <Text strong style={{ display: 'block', marginBottom: 16, color: '#1890ff' }}>
            Vital Signs History
          </Text>

          <Collapse 
            accordion
            onChange={(key) => setActiveTimeline(key)}
            style={{ marginBottom: 16 }}
          >
            {sortedVitals.map((vitalRecord, index) => (
              <Panel 
                key={index} 
                header={
                  <span>
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    {moment(vitalRecord.createdAt).format("MMM D, YYYY h:mm A")}
                    <Tag color={index === 0 ? "green" : "default"} style={{ marginLeft: 8 }}>
                      {index === 0 ? "Latest" : `#${index + 1}`}
                    </Tag>
                  </span>
                }
              >
                <Row gutter={[8, 8]}>
                  {primaryVitals.filter(key => hasVitalData(key, vitalRecord)).map(vitalKey => (
                    <Col key={vitalKey} xs={24} sm={12} md={8} lg={6} style={{ padding: 4 }}>
                      <VitalCard vitalKey={vitalKey} vitals={vitalRecord} />
                    </Col>
                  ))}
                  
                  {secondaryVitals.filter(key => hasVitalData(key, vitalRecord)).map(vitalKey => (
                    <Col key={vitalKey} xs={24} sm={12} md={8} lg={6} style={{ padding: 4 }}>
                      <VitalCard vitalKey={vitalKey} vitals={vitalRecord} />
                    </Col>
                  ))}
                </Row>
                
                {vitalRecord.notes && (
                  <div style={{ marginTop: 16, padding: 12, background: '#f0f8ff', borderRadius: 6 }}>
                    <Text strong>Notes: </Text>
                    <Text type="secondary">{vitalRecord.notes}</Text>
                  </div>
                )}
              </Panel>
            ))}
          </Collapse>

          {/* Timeline View Alternative */}
          <div style={{ marginTop: 24 }}>
            <Text strong style={{ display: 'block', marginBottom: 12 }}>
              Timeline Overview
            </Text>
            <Timeline>
              {sortedVitals.slice(0, 10).map((vitalRecord, index) => (
                <Timeline.Item key={index} color={index === 0 ? "green" : "blue"}>
                  <Text strong>{moment(vitalRecord.createdAt).format("MMM D, h:mm A")}</Text>
                  <div style={{ marginTop: 4 }}>
                    {primaryVitals.filter(key => hasVitalData(key, vitalRecord)).slice(0, 3).map(vitalKey => {
                      const config = vitalConfig[vitalKey];
                      const value = Array.isArray(config.field) 
                        ? config.format(vitalRecord) 
                        : vitalRecord[config.field];
                      return (
                        <Tag key={vitalKey} size="small" style={{ margin: 2 }}>
                          {config.label}: {value}{config.unit}
                        </Tag>
                      );
                    })}
                    {primaryVitals.filter(key => hasVitalData(key, vitalRecord)).length > 3 && (
                      <Tag size="small">+{primaryVitals.filter(key => hasVitalData(key, vitalRecord)).length - 3} more</Tag>
                    )}
                  </div>
                </Timeline.Item>
              ))}
              {sortedVitals.length > 10 && (
                <Timeline.Item color="gray">
                  <Text type="secondary">+{sortedVitals.length - 10} more records</Text>
                </Timeline.Item>
              )}
            </Timeline>
          </div>
        </div>
      )}

      {/* Abnormal Vitals Summary */}
      {expanded && (
        <div style={{ marginTop: 16, padding: 12, background: "#fff2f0", borderRadius: 6 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            ⚠️ Hover over the warning icons to see abnormal values and their normal ranges.
          </Text>
        </div>
      )}
    </Card>
  );
};

export default PatientVitals;