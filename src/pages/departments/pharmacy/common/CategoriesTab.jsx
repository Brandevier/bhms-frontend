import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';

const CategoriesTab = ({ data }) => {
  // This would need actual category data from your backend
  // For now, using placeholder data based on what's available
  const categoryStats = [
    { name: 'Suppository', count: 2, percentage: 50 },
    { name: 'Suspension', count: 1, percentage: 25 },
    { name: 'Injection', count: 1, percentage: 25 }
  ];

  return (
    <Card title="Medication Categories">
      <Row gutter={16}>
        {categoryStats.map((category, index) => (
          <Col span={8} key={index}>
            <Card size="small">
              <Statistic
                title={category.name}
                value={category.count}
                suffix={`(${category.percentage}%)`}
              />
              <Progress 
                percent={category.percentage} 
                size="small" 
                showInfo={false}
              />
            </Card>
          </Col>
        ))}
      </Row>
      
      <div style={{ marginTop: 24 }}>
        <Statistic
          title="Average Prescription Duration"
          value={data.duration?.avg_duration_days ? parseFloat(data.duration.avg_duration_days).toFixed(1) : 0}
          suffix="days"
        />
      </div>
    </Card>
  );
};

export default CategoriesTab;