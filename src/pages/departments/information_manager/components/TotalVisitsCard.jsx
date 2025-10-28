// components/patient/TotalVisitsCard.js
import React from 'react';
import { Card, Statistic, Typography } from 'antd';
import { UserOutlined, ArrowUpOutlined } from '@ant-design/icons';

const { Text } = Typography;

const TotalVisitsCard = ({ totalVisits, previousPeriod }) => {
  const growth = previousPeriod ? 
    Math.round(((totalVisits - previousPeriod) / previousPeriod) * 100) : 0;

  return (
    <Card className="text-center">
      <Statistic
        title="Total Visits"
        value={totalVisits || 0}
        prefix={<UserOutlined />}
        valueStyle={{ color: '#3f8600' }}
      />
      {previousPeriod && (
        <Text type="secondary" className="flex items-center justify-center mt-2">
          <ArrowUpOutlined style={{ color: growth >= 0 ? '#52c41a' : '#ff4d4f' }} />
          <span style={{ color: growth >= 0 ? '#52c41a' : '#ff4d4f', marginLeft: 4 }}>
            {Math.abs(growth)}% {growth >= 0 ? 'increase' : 'decrease'} from previous period
          </span>
        </Text>
      )}
    </Card>
  );
};

export default TotalVisitsCard;