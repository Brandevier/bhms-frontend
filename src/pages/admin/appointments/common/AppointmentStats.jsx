// AppointmentStats.jsx
import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { 
  CalendarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';

const AppointmentStats = ({ appointments }) => {
  const stats = {
    total: appointments?.length || 0,
    scheduled: appointments?.filter(a => a.status === 'scheduled').length || 0,
    completed: appointments?.filter(a => a.status === 'completed').length || 0,
    cancelled: appointments?.filter(a => a.status === 'cancelled').length || 0,
  };

  return (
    <Row gutter={16} className="mb-6">
      <Col xs={24} sm={12} lg={6} className="mb-4">
        <Card>
          <Statistic
            title="Total Appointments"
            value={stats.total}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6} className="mb-4">
        <Card>
          <Statistic
            title="Scheduled"
            value={stats.scheduled}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6} className="mb-4">
        <Card>
          <Statistic
            title="Completed"
            value={stats.completed}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6} className="mb-4">
        <Card>
          <Statistic
            title="Cancelled"
            value={stats.cancelled}
            prefix={<CloseCircleOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default AppointmentStats;