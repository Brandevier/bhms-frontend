// components/staff/StaffPerformance.js
import React from 'react';
import { Card, Progress, Statistic, Row, Col, Typography, List, Tag } from 'antd';
import { StarOutlined, TrophyOutlined, RiseOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StaffPerformance = ({ staffId, staffName }) => {
  // Dummy data - replace with actual API data
  const performanceMetrics = {
    overallRating: 4.5,
    productivity: 92,
    attendance: 98,
    patientSatisfaction: 4.8,
    completedTasks: 156,
    pendingTasks: 12
  };

  const recentReviews = [
    {
      id: 1,
      reviewer: 'Patient - John D.',
      rating: 5,
      comment: 'Excellent care and attention to detail. Very professional.',
      date: '2024-01-10'
    },
    {
      id: 2,
      reviewer: 'Dr. Sarah M.',
      rating: 4,
      comment: 'Great teamwork and communication skills.',
      date: '2024-01-08'
    },
    {
      id: 3,
      reviewer: 'Nursing Staff',
      rating: 5,
      comment: 'Always helpful and supportive to the team.',
      date: '2024-01-05'
    }
  ];

  const goals = [
    { target: 'Complete training', progress: 100, status: 'completed' },
    { target: 'Patient satisfaction', progress: 85, status: 'in-progress' },
    { target: 'Certification renewal', progress: 30, status: 'in-progress' }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarOutlined
        key={index}
        style={{ color: index < rating ? '#fadb14' : '#d9d9d9' }}
      />
    ));
  };

  return (
    <Card 
      title={
        <span className="flex items-center">
          <TrophyOutlined className="mr-2 text-yellow-500" />
          Performance Metrics
        </span>
      }
      className="mt-6"
    >
      {/* Key Metrics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={8} md={6}>
          <Card size="small">
            <Statistic
              title="Overall Rating"
              value={performanceMetrics.overallRating}
              precision={1}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Card size="small">
            <Statistic
              title="Productivity"
              value={performanceMetrics.productivity}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Card size="small">
            <Statistic
              title="Attendance"
              value={performanceMetrics.attendance}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Card size="small">
            <Statistic
              title="Patient Satisfaction"
              value={performanceMetrics.patientSatisfaction}
              precision={1}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Goals Progress */}
      <div className="mb-6">
        <Title level={5}>Goals Progress</Title>
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <Text>{goal.target}</Text>
                <Text>{goal.progress}%</Text>
              </div>
              <Progress
                percent={goal.progress}
                status={
                  goal.status === 'completed' ? 'success' :
                  goal.status === 'in-progress' ? 'active' : 'exception'
                }
                size="small"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div>
        <Title level={5}>Recent Feedback</Title>
        <List
          dataSource={recentReviews}
          renderItem={(review) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div className="flex justify-between items-start">
                    <Text strong>{review.reviewer}</Text>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                }
                description={
                  <div>
                    <p className="mb-1">{review.comment}</p>
                    <Text type="secondary" className="text-sm">
                      {review.date}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>

      {/* Task Completion */}
      <div className="mt-6">
        <Title level={5}>Task Completion</Title>
        <div className="grid grid-cols-2 gap-4">
          <Card size="small" className="text-center">
            <Statistic
              title="Completed Tasks"
              value={performanceMetrics.completedTasks}
              valueStyle={{ color: '#52c41a' }}
              prefix={<RiseOutlined />}
            />
          </Card>
          <Card size="small" className="text-center">
            <Statistic
              title="Pending Tasks"
              value={performanceMetrics.pendingTasks}
              valueStyle={{ color: '#faad14' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default StaffPerformance;