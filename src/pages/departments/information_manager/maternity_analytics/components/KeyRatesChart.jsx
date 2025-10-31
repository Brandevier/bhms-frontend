// components/maternity/components/KeyRatesChart.js
import React from 'react';
import { Card, Progress, Row, Col, Typography } from 'antd';

const { Text, Title } = Typography;

const KeyRatesChart = ({ data }) => {
  const rates = [
    {
      label: 'Caesarean Rate',
      value: data.caesareanRate,
      color: data.caesareanRate > 30 ? '#ff4d4f' : '#52c41a',
      description: 'WHO recommends 10-15%'
    },
    {
      label: 'Stillbirth Rate',
      value: data.stillbirthRate,
      color: data.stillbirthRate > 20 ? '#ff4d4f' : '#52c41a',
      description: 'Per 1,000 births'
    },
    {
      label: 'Neonatal Death Rate',
      value: data.neonatalDeathRate,
      color: data.neonatalDeathRate > 15 ? '#ff4d4f' : '#52c41a',
      description: 'Per 1,000 live births'
    },
    {
      label: 'Live Birth Rate',
      value: data.liveBirthRate,
      color: '#1890ff',
      description: 'Percentage of total births'
    }
  ];

  return (
    <Card title="Key Performance Indicators" className="h-full">
      <div className="space-y-6">
        {rates.map((rate, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <Text strong>{rate.label}</Text>
              <Text style={{ color: rate.color, fontWeight: 'bold' }}>
                {rate.value.toFixed(1)}%
              </Text>
            </div>
            <Progress 
              percent={Math.min(rate.value, 100)} 
              strokeColor={rate.color}
              showInfo={false}
            />
            <Text type="secondary" className="text-xs block mt-1">
              {rate.description}
            </Text>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default KeyRatesChart;