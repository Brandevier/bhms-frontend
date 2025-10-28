import React, { useEffect, useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Progress, 
  List, 
  Tag, 
  Typography, 
  Spin, 
  Alert,
  Divider,
  Empty
} from 'antd';
import { 
  BarChartOutlined, 
  UserOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  FileTextOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { useUltrasoundActions, useUltrasoundStats, useUltrasoundLoading, useUltrasoundError } from '../../../../redux/hooks/useUltrasound';
import moment from 'moment';

const { Title, Text } = Typography;

const UltraSoundStats = () => {
  const { fetchUltrasoundStats, clearUltrasoundError } = useUltrasoundActions();
  const stats = useUltrasoundStats();
  const loading = useUltrasoundLoading();
  const error = useUltrasoundError();
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchUltrasoundStats({ timeRange });
  }, [timeRange, fetchUltrasoundStats]);

  useEffect(() => {
    if (error) {
      console.error('Stats Error:', error);
    }
  }, [error]);

  const handleRetry = () => {
    clearUltrasoundError();
    fetchUltrasoundStats({ timeRange });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" tip="Loading ultrasound statistics..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Statistics"
        description={error || 'Failed to load ultrasound statistics. Please try again.'}
        type="error"
        showIcon
        action={
          <button onClick={handleRetry} className="text-blue-600 hover:text-blue-800">
            Retry
          </button>
        }
      />
    );
  }

  if (!stats) {
    return (
      <Empty
        description="No statistics data available"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const {
    total = 0,
    byScanType = [],
    byDepartment = [],
    byStaff = [],
    byMonth = [],
    topIndications = []
  } = stats;

  // Calculate percentages for progress bars
  const getPercentage = (count, total) => Math.round((count / total) * 100);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
        <Title level={2} className="flex items-center">
          <DashboardOutlined className="mr-3 text-blue-500" />
          Ultrasound Statistics
        </Title>
        
        <div className="flex gap-2 mt-4 lg:mt-0">
          {['all', 'month', 'quarter', 'year'].map((range) => (
            <Tag
              key={range}
              color={timeRange === range ? 'blue' : 'default'}
              className="cursor-pointer px-3 py-1"
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Tag>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center h-full">
            <Statistic
              title="Total Ultrasounds"
              value={total}
              valueStyle={{ color: '#3f8600' }}
              prefix={<BarChartOutlined />}
            />
            <Text type="secondary" className="text-sm">
              Overall scans performed
            </Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center h-full">
            <Statistic
              title="Scan Types"
              value={byScanType.length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<FileTextOutlined />}
            />
            <Text type="secondary" className="text-sm">
              Different types of scans
            </Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center h-full">
            <Statistic
              title="Departments"
              value={byDepartment.length}
              valueStyle={{ color: '#faad14' }}
              prefix={<TeamOutlined />}
            />
            <Text type="secondary" className="text-sm">
              Involved departments
            </Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center h-full">
            <Statistic
              title="Staff Members"
              value={byStaff.length}
              valueStyle={{ color: '#f50' }}
              prefix={<UserOutlined />}
            />
            <Text type="secondary" className="text-sm">
              Performing staff
            </Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Scan Type Distribution */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span className="flex items-center">
                <FileTextOutlined className="mr-2 text-blue-500" />
                Scan Type Distribution
              </span>
            }
            className="h-full"
          >
            {byScanType.length > 0 ? (
              <div className="space-y-4">
                {byScanType.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Text strong>{item.scan_type || 'Unknown'}</Text>
                      <Text className="font-mono">{item.count} scans</Text>
                    </div>
                    <Progress
                      percent={getPercentage(parseInt(item.count), total)}
                      size="small"
                      strokeColor={
                        index % 4 === 0 ? '#3f8600' :
                        index % 4 === 1 ? '#1890ff' :
                        index % 4 === 2 ? '#faad14' : '#f50'
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="No scan type data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>

        {/* Department Performance */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span className="flex items-center">
                <TeamOutlined className="mr-2 text-green-500" />
                Department Performance
              </span>
            }
            className="h-full"
          >
            {byDepartment.length > 0 ? (
              <List
                dataSource={byDepartment}
                renderItem={(item, index) => (
                  <List.Item>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex-1">
                        <Text strong>{item.department?.name || 'Unknown Department'}</Text>
                        <br />
                        <Text type="secondary" className="text-sm">
                          {item.count} scans
                        </Text>
                      </div>
                      <Tag color={
                        index === 0 ? 'green' :
                        index === 1 ? 'blue' :
                        index === 2 ? 'orange' : 'default'
                      }>
                        #{index + 1}
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No department data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>

        {/* Top Performing Staff */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span className="flex items-center">
                <UserOutlined className="mr-2 text-purple-500" />
                Top Performing Staff
              </span>
            }
            className="h-full"
          >
            {byStaff.length > 0 ? (
              <List
                dataSource={byStaff}
                renderItem={(item, index) => (
                  <List.Item>
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <Text strong>
                          {item.staff?.firstName} {item.staff?.lastName}
                        </Text>
                        <br />
                        <Text type="secondary" className="text-sm">
                          {item.count} scans performed
                        </Text>
                      </div>
                      <Progress
                        type="circle"
                        percent={getPercentage(parseInt(item.count), total)}
                        size={50}
                        strokeColor={
                          index === 0 ? '#3f8600' :
                          index === 1 ? '#1890ff' :
                          index === 2 ? '#faad14' : '#f50'
                        }
                      />
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No staff data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>

        {/* Monthly Trends */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span className="flex items-center">
                <CalendarOutlined className="mr-2 text-orange-500" />
                Monthly Trends
              </span>
            }
            className="h-full"
          >
            {byMonth.length > 0 ? (
              <div className="space-y-4">
                {byMonth.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <Text>
                      {moment(item.month).format('MMM YYYY')}
                    </Text>
                    <Tag color="blue">{item.count} scans</Tag>
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="No monthly data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>

        {/* Top Indications */}
        {topIndications && topIndications.length > 0 && (
          <Col xs={24}>
            <Card 
              title={
                <span className="flex items-center">
                  <FileTextOutlined className="mr-2 text-red-500" />
                  Top Indications
                </span>
              }
            >
              <div className="flex flex-wrap gap-2">
                {topIndications.map((item, index) => (
                  <Tag key={index} color={
                    index % 5 === 0 ? 'magenta' :
                    index % 5 === 1 ? 'volcano' :
                    index % 5 === 2 ? 'orange' :
                    index % 5 === 3 ? 'green' : 'cyan'
                  }>
                    {item.indication} ({item.count})
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
        )}
      </Row>

      {/* Summary Section */}
      <Divider />
      <Card>
        <Title level={4}>Summary</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Text strong>Total Scans: </Text>
            <Text>{total}</Text>
          </Col>
          <Col xs={24} sm={12}>
            <Text strong>Time Range: </Text>
            <Text>{timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</Text>
          </Col>
          <Col xs={24} sm={12}>
            <Text strong>Most Common Scan Type: </Text>
            <Text>{byScanType[0]?.scan_type || 'N/A'}</Text>
          </Col>
          <Col xs={24} sm={12}>
            <Text strong>Top Department: </Text>
            <Text>{byDepartment[0]?.department?.name || 'N/A'}</Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default UltraSoundStats;