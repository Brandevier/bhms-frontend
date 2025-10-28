// SummaryCards.jsx
import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';

const SummaryCards = ({ summary }) => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={12} lg={6} className="mb-4">
        <Card>
          <Statistic
            title="Total Patients"
            value={summary?.totalInpatients + summary?.totalOutpatients || 0}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6} className="mb-4">
        <Card>
          <Statistic
            title="Inpatients"
            value={summary?.totalInpatients || 0}
            suffix={summary?.percentageInpatients || '0%'}
            valueStyle={{ color: '#1890ff' }}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6} className="mb-4">
        <Card>
          <Statistic
            title="Outpatients"
            value={summary?.totalOutpatients || 0}
            suffix={summary?.percentageOutpatients || '0%'}
            valueStyle={{ color: '#cf1322' }}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6} className="mb-4">
        <Card>
          <Statistic
            title="Gender Distribution"
            value={summary?.genderSummary?.length || 0}
            suffix="Categories"
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;