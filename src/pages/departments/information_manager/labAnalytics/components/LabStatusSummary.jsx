// components/lab/components/LabStatusSummary.js
import React from 'react';
import { Card, Row, Col, Progress, Statistic, Tag } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, ExperimentOutlined } from '@ant-design/icons';

const LabStatusSummary = ({ data }) => {
  const pending = data?.find(item => item.status === 'pending')?.count || 0;
  const completed = data?.find(item => item.status === 'completed')?.count || 0;
  const total = parseInt(pending) + parseInt(completed);
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card title="Test Status Overview" className="h-full">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <div className="text-center">
            <Statistic
              title="Total Tests"
              value={total}
              prefix={<ExperimentOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="text-center">
            <Statistic
              title="Pending Tests"
              value={pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="text-center">
            <Statistic
              title="Completed Tests"
              value={completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </div>
        </Col>
      </Row>
      
      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Completion Progress</span>
          <Tag color={completionRate >= 80 ? 'success' : completionRate >= 50 ? 'warning' : 'error'}>
            {completionRate}%
          </Tag>
        </div>
        <Progress 
          percent={completionRate}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          showInfo={false}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Pending: {pending}</span>
          <span>Completed: {completed}</span>
        </div>
      </div>
    </Card>
  );
};

export default LabStatusSummary;