// components/maternity/ANCStatistics.js
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

const ANCStatistics = ({ statistics }) => {
  const { totalPatients, newPatients, followUpPatients, activePatients } = statistics;

  return (
    <Row gutter={16} className="mb-6">
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Patients"
            value={totalPatients}
            valueStyle={{ color: '#3f8600' }}
            prefix={<UserAddOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="New Patients"
            value={newPatients}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Follow-up Patients"
            value={followUpPatients}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Active Patients"
            value={activePatients}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ANCStatistics;