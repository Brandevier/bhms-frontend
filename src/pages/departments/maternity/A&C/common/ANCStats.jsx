// components/maternity/ANCStatistics.js
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const ANCStats = ({ ancRecord }) => {
  return (
    <Row gutter={[16, 16]} className="mb-6">
      <Col span={8}>
        <Card>
          <Statistic
            title="ANC Number"
            value={ancRecord?.anc_number || 'N/A'}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#3f8600', fontSize: '16px' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Gestational Age"
            value={ancRecord?.gestational_age_weeks || 'N/A'}
            suffix="weeks"
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Mother's Age"
            value={ancRecord?.mother_age || 'N/A'}
            suffix="years"
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ANCStats;