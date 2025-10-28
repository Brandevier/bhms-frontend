import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  ExperimentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';

const LabTestsStats = ({ tests }) => {
  const stats = tests.reduce(
    (acc, test) => {
      acc.total++;
      if (test.status === 'completed') acc.completed++;
      if (test.status === 'pending') acc.pending++;
      if (test.status === 'in_progress') acc.inProgress++;
      return acc;
    },
    { total: 0, completed: 0, pending: 0, inProgress: 0 }
  );

  const completionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;

  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col xs={12} sm={6}>
        <Card>
          <Statistic
            title="Total Tests"
            value={stats.total}
            prefix={<ExperimentOutlined />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card>
          <Statistic
            title="Completed"
            value={stats.completed}
            valueStyle={{ color: '#52c41a' }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card>
          <Statistic
            title="Pending"
            value={stats.pending}
            valueStyle={{ color: '#faad14' }}
            prefix={<ClockCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card>
          <Statistic
            title="Completion Rate"
            value={completionRate}
            suffix="%"
            valueStyle={{ color: '#1890ff' }}
            prefix={<SyncOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default LabTestsStats;