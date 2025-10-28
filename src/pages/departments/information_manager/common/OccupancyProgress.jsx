// components/bed/OccupancyProgress.js
import React from 'react';
import { Card, Row, Col, Progress, Tag, Typography } from 'antd';

const { Text } = Typography;

const OccupancyProgress = ({ totalBeds, occupiedCount, availableCount, maintenanceCount, occupancyRate }) => {
  if (totalBeds <= 0) return null;

  return (
    <Card title="Bed Occupancy" className="mb-6">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <Text>Occupancy Rate</Text>
            <Text strong>{occupancyRate}</Text>
          </div>
          <Progress 
            percent={parseFloat(occupancyRate)} 
            status={parseFloat(occupancyRate) > 80 ? 'exception' : 'active'}
            strokeColor={parseFloat(occupancyRate) > 80 ? '#ff4d4f' : '#1890ff'}
          />
        </div>
        
        <Row gutter={[16, 16]}>
          <Col xs={8}>
            <div className="text-center">
              <Tag color="green">Available</Tag>
              <Text strong className="block">{availableCount}</Text>
            </div>
          </Col>
          <Col xs={8}>
            <div className="text-center">
              <Tag color="red">Occupied</Tag>
              <Text strong className="block">{occupiedCount}</Text>
            </div>
          </Col>
          <Col xs={8}>
            <div className="text-center">
              <Tag color="orange">Maintenance</Tag>
              <Text strong className="block">{maintenanceCount}</Text>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default OccupancyProgress;