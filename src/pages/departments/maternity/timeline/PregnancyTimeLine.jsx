import React, { useEffect } from 'react';
import { 
  Card, 
  Spin, 
  Typography, 
  Timeline, 
  Progress, 
  Row, 
  Col, 
  Statistic,
  Alert,
  Button 
} from 'antd';
import { 
  CalendarOutlined, 
  ReloadOutlined,
  HeartOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import { useANCActions, usePregnancyTimeline, useANCLoading, useANCError } from '../../../../redux/hooks/useANC';

const { Title, Text } = Typography;

const PregnancyTimeline = ({ visitId }) => {
  const { fetchPregnancyTimeline, clearANCError } = useANCActions();
  const timelineData = usePregnancyTimeline();
  const loading = useANCLoading();
  const error = useANCError();

  useEffect(() => {
    if (visitId) {
      fetchPregnancyTimeline(visitId);
    }
  }, [visitId, fetchPregnancyTimeline]);

  useEffect(() => {
    if (error) {
      console.error('Pregnancy Timeline Error:', error);
    }
  }, [error]);

  const handleRetry = () => {
    clearANCError();
    if (visitId) {
      fetchPregnancyTimeline(visitId);
    }
  };

  const handleRefresh = () => {
    if (visitId) {
      fetchPregnancyTimeline(visitId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spin size="large" tip="Loading pregnancy timeline..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Error Loading Pregnancy Timeline"
          description={error || 'Failed to load pregnancy timeline. Please try again.'}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={handleRetry}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  if (!timelineData) {
    return (
      <div className="p-6">
        <Alert
          message="No Pregnancy Timeline"
          description="No pregnancy timeline data available for this visit."
          type="info"
          showIcon
        />
      </div>
    );
  }

  // Calculate weeks information
  const { lmp, edd, current_week, total_weeks, progress_percent, weeks = [] } = timelineData;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="flex items-center">
          <CalendarOutlined className="mr-2 text-blue-500" />
          Pregnancy Timeline
        </Title>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          loading={loading}
          size="small"
        >
          Refresh
        </Button>
      </div>

      {/* Key Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Current Week"
              value={current_week || 0}
              suffix="weeks"
              valueStyle={{ color: '#3f8600' }}
              prefix={<HeartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Weeks"
              value={total_weeks || 40}
              suffix="weeks"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Progress"
              value={progress_percent || 0}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Weeks Completed"
              value={weeks.length || 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Progress Bar */}
      <Card title="Pregnancy Progress" className="mb-6">
        <div className="mb-4">
          <Text strong className="block mb-2">Overall Progress: {progress_percent || 0}%</Text>
          <Progress 
            percent={progress_percent || 0} 
            status="active" 
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>LMP (Last Menstrual Period):</Text>
            <Text className="block">{lmp ? new Date(lmp).toLocaleDateString() : 'N/A'}</Text>
          </Col>
          <Col span={12}>
            <Text strong>EDD (Estimated Due Date):</Text>
            <Text className="block">{edd ? new Date(edd).toLocaleDateString() : 'N/A'}</Text>
          </Col>
        </Row>
      </Card>

      {/* Timeline of Weeks */}
      <Card title="Pregnancy Timeline">
        {weeks.length > 0 ? (
          <Timeline mode="alternate">
            {weeks.map((week, index) => (
              <Timeline.Item
                key={index}
                color={week.completed ? "green" : "blue"}
                dot={week.completed ? <ClockCircleOutlined /> : null}
              >
                <Card size="small" title={`Week ${week.week}`}>
                  <Text strong>Milestones:</Text>
                  {week.milestones && week.milestones.length > 0 ? (
                    <ul className="mt-2">
                      {week.milestones.map((milestone, idx) => (
                        <li key={idx}>{milestone}</li>
                      ))}
                    </ul>
                  ) : (
                    <Text type="secondary" className="block mt-2">No milestones recorded</Text>
                  )}
                  
                  {week.visit_date && (
                    <Text type="secondary" className="block mt-2">
                      Visit: {new Date(week.visit_date).toLocaleDateString()}
                    </Text>
                  )}
                  
                  {week.completed && (
                    <Tag color="green" className="mt-2">Completed</Tag>
                  )}
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Alert
            message="No Timeline Data"
            description="No weekly timeline data available yet. ANC visits will populate this timeline."
            type="info"
            showIcon
          />
        )}
      </Card>

      {/* Additional Information */}
      <Card title="Pregnancy Information" className="mt-6">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Trimester: </Text>
            <Text>
              {current_week <= 13 ? 'First Trimester' : 
               current_week <= 26 ? 'Second Trimester' : 'Third Trimester'}
            </Text>
          </Col>
          <Col span={12}>
            <Text strong>Weeks Remaining: </Text>
            <Text>{total_weeks - current_week} weeks</Text>
          </Col>
          <Col span={12}>
            <Text strong>Days Remaining: </Text>
            <Text>{(total_weeks - current_week) * 7} days</Text>
          </Col>
          <Col span={12}>
            <Text strong>Estimated Delivery: </Text>
            <Text>{edd ? new Date(edd).toLocaleDateString() : 'N/A'}</Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PregnancyTimeline;