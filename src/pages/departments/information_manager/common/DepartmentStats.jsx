// components/bed/DepartmentStats.js
import React from 'react';
import { Card, Row, Col, Progress, Typography, Empty } from 'antd';

const { Text } = Typography;

const DepartmentStats = ({ departmentStats, totalBeds }) => {
  if (!departmentStats || departmentStats.length === 0) {
    return (
      <Card title="Department Statistics" className="mb-6">
        <Empty description="No department statistics available" />
      </Card>
    );
  }

  return (
    <Card title="Department-wise Statistics" className="mb-6">
      <Row gutter={[16, 16]}>
        {departmentStats.map((dept, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card size="small">
              <Text strong>{dept.department}</Text>
              <div className="mt-2">
                <Progress 
                  percent={Math.round((dept.count / totalBeds) * 100)} 
                  size="small" 
                />
                <Text type="secondary" className="text-sm">
                  {dept.count} beds • {dept.status}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default DepartmentStats;