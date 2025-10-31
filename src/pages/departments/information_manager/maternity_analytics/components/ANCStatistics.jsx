// components/maternity/components/ANCStatistics.js
import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { UserOutlined, NumberOutlined, CalendarOutlined } from '@ant-design/icons';

const ANCStatistics = ({ data }) => {
  return (
    <Card title="Antenatal Care Statistics" className="h-full">
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={8}>
          <div className="text-center">
            <Statistic
              title="Avg. Mother Age"
              value={data.averageMotherAge}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="years"
            />
          </div>
        </Col>
        <Col xs={8}>
          <div className="text-center">
            <Statistic
              title="Avg. Parity"
              value={data.averageParity}
              prefix={<NumberOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </div>
        </Col>
        <Col xs={8}>
          <div className="text-center">
            <Statistic
              title="Avg. Gestational Age"
              value={data.averageGestationalAge}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix="weeks"
            />
          </div>
        </Col>
      </Row>
      
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <Text strong>ANC Visit Progress</Text>
          <Text strong>{data.totalVisits} Total Visits</Text>
        </div>
        <Progress 
          percent={data.totalVisits > 0 ? 100 : 0}
          status={data.totalVisits > 0 ? 'success' : 'normal'}
          showInfo={false}
        />
      </div>
    </Card>
  );
};

export default ANCStatistics;