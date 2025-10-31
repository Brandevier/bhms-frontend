// components/maternity/components/MaternalHealth.js
import React from 'react';
import { Card, Row, Col, Statistic, Empty } from 'antd';
import { SafetyOutlined, ExperimentOutlined, ScanOutlined } from '@ant-design/icons';

const MaternalHealth = ({ hivStats, maternalDemographics, ultrasoundStats }) => {
  const hasData = hivStats.testedCount > 0 || maternalDemographics.anemiaRate > 0 || ultrasoundStats.total > 0;

  if (!hasData) {
    return (
      <Card title="Maternal Health Indicators" className="h-full">
        <Empty 
          description="No maternal health data available" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card title="Maternal Health Indicators" className="h-full">
      <Row gutter={[16, 16]}>
        {hivStats.testedCount > 0 && (
          <Col xs={24} sm={8}>
            <div className="text-center">
              <Statistic
                title="HIV Prevalence"
                value={hivStats.prevalence}
                prefix={<SafetyOutlined />}
                valueStyle={{ color: hivStats.prevalence > 5 ? '#ff4d4f' : '#52c41a' }}
                suffix="%"
              />
              <div className="text-xs text-gray-500 mt-1">
                {hivStats.testedCount} tested
              </div>
            </div>
          </Col>
        )}

        {maternalDemographics.anemiaRate > 0 && (
          <Col xs={24} sm={8}>
            <div className="text-center">
              <Statistic
                title="Anemia Rate"
                value={maternalDemographics.anemiaRate}
                prefix={<ExperimentOutlined />}
                valueStyle={{ color: maternalDemographics.anemiaRate > 40 ? '#ff4d4f' : '#faad14' }}
                suffix="%"
              />
              <div className="text-xs text-gray-500 mt-1">
                Hemoglobin  11.0 g/dL
              </div>
            </div>
          </Col>
        )}

        {ultrasoundStats.utilizationRate > 0 && (
          <Col xs={24} sm={8}>
            <div className="text-center">
              <Statistic
                title="Ultrasound Utilization"
                value={ultrasoundStats.utilizationRate}
                prefix={<ScanOutlined />}
                valueStyle={{ color: '#1890ff' }}
                suffix="%"
              />
              <div className="text-xs text-gray-500 mt-1">
                Of ANC visits
              </div>
            </div>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default MaternalHealth;