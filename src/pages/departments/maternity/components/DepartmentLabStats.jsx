import React, { useEffect } from 'react';
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
  Empty,
  Badge
} from 'antd';
import { 
  ExperimentOutlined, 
  UserOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getLabTestStats } from '../../../../redux/slice/labSlice';
import moment from 'moment';

const { Title, Text } = Typography;

const DepartmentLabStats = () => {
  const dispatch = useDispatch();
  const { testStats, loading, error } = useSelector((state) => state.lab);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.department_id) {
      dispatch(getLabTestStats({ department_id: user.department_id }));
    }
  }, [dispatch, user?.department_id]);

  const handleRetry = () => {
    if (user?.department_id) {
      dispatch(getLabTestStats({ department_id: user.department_id }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" tip="Loading lab test statistics..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Statistics"
        description={error || 'Failed to load lab test statistics. Please try again.'}
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

  if (!testStats) {
    return (
      <Empty
        description="No lab test statistics available"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const {
    total = 0,
    byStatus = [],
    byDepartment = [],
    byStaff = [],
  } = testStats;

  // Calculate percentages for progress bars
  const getPercentage = (count, total) => Math.round((count / total) * 100);

  // Get status color and icon
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'green', icon: <CheckCircleOutlined />, text: 'Completed' };
      case 'pending':
        return { color: 'orange', icon: <ClockCircleOutlined />, text: 'Pending' };
      case 'in_progress':
        return { color: 'blue', icon: <SyncOutlined spin />, text: 'In Progress' };
      case 'cancelled':
        return { color: 'red', icon: <CloseCircleOutlined />, text: 'Cancelled' };
      default:
        return { color: 'default', icon: null, text: status };
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
        <Title level={2} className="flex items-center">
          <ExperimentOutlined className="mr-3 text-blue-500" />
          Lab Test Statistics
          {user?.department?.name && (
            <Tag color="blue" className="ml-3">
              {user.department.name}
            </Tag>
          )}
        </Title>
        
        <Text type="secondary">
          Last updated: {moment().format('MMM D, YYYY h:mm A')}
        </Text>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center h-full">
            <Statistic
              title="Total Tests"
              value={total}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ExperimentOutlined />}
            />
            <Text type="secondary" className="text-sm">
              Overall tests conducted
            </Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center h-full">
            <Statistic
              title="Test Status"
              value={byStatus.length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<DashboardOutlined />}
            />
            <Text type="secondary" className="text-sm">
              Different status types
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
        {/* Test Status Distribution */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span className="flex items-center">
                <DashboardOutlined className="mr-2 text-blue-500" />
                Test Status Distribution
              </span>
            }
            className="h-full"
          >
            {byStatus.length > 0 ? (
              <div className="space-y-4">
                {byStatus.map((item, index) => {
                  const statusConfig = getStatusConfig(item.status);
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="mr-2">{statusConfig.icon}</span>
                          <Text strong>{statusConfig.text}</Text>
                        </div>
                        <Text className="font-mono">{item.count} tests</Text>
                      </div>
                      <Progress
                        percent={getPercentage(parseInt(item.count), total)}
                        size="small"
                        strokeColor={statusConfig.color}
                        showInfo={false}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <Text>{getPercentage(parseInt(item.count), total)}%</Text>
                        <Text>{item.count} of {total}</Text>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty description="No status data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>

        {/* Department Breakdown */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span className="flex items-center">
                <TeamOutlined className="mr-2 text-green-500" />
                Department Breakdown
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
                          {item.count} tests
                        </Text>
                      </div>
                      <Badge 
                        count={item.count} 
                        showZero 
                        style={{ 
                          backgroundColor: index === 0 ? '#52c41a' : 
                                        index === 1 ? '#1890ff' : 
                                        index === 2 ? '#faad14' : '#d9d9d9' 
                        }}
                      />
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No department data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>

        {/* Staff Performance */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span className="flex items-center">
                <UserOutlined className="mr-2 text-purple-500" />
                Staff Performance
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
                          {item.creator?.firstName} {item.creator?.lastName}
                        </Text>
                        <br />
                        <Text type="secondary" className="text-sm">
                          ID: {item.createdBy}
                        </Text>
                      </div>
                      <div className="text-right">
                        <Text strong className="text-lg block">
                          {item.count}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          tests
                        </Text>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No staff data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>

        {/* Quick Insights */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span className="flex items-center">
                <DashboardOutlined className="mr-2 text-orange-500" />
                Quick Insights
              </span>
            }
            className="h-full"
          >
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Text strong className="text-blue-800">
                  📊 Total Tests Conducted
                </Text>
                <br />
                <Text className="text-blue-600">{total} tests</Text>
              </div>

              {byStatus.find(s => s.status === 'pending') && (
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Text strong className="text-orange-800">
                    ⏳ Pending Tests
                  </Text>
                  <br />
                  <Text className="text-orange-600">
                    {byStatus.find(s => s.status === 'pending')?.count} tests awaiting results
                  </Text>
                </div>
              )}

              {byStatus.find(s => s.status === 'completed') && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <Text strong className="text-green-800">
                    ✅ Completed Tests
                  </Text>
                  <br />
                  <Text className="text-green-600">
                    {byStatus.find(s => s.status === 'completed')?.count} tests completed
                  </Text>
                </div>
              )}

              {byDepartment[0] && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Text strong className="text-gray-800">
                    🏆 Top Department
                  </Text>
                  <br />
                  <Text className="text-gray-600">
                    {byDepartment[0]?.department?.name} with {byDepartment[0]?.count} tests
                  </Text>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Detailed Summary Section */}
      <Divider />
      <Card>
        <Title level={4}>Detailed Summary</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <Text strong>Total Tests:</Text>
                <Tag color="blue">{total}</Tag>
              </div>
              
              {byStatus.map((status, index) => {
                const config = getStatusConfig(status.status);
                return (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <span className="mr-2">{config.icon}</span>
                      <Text>{config.text}:</Text>
                    </div>
                    <Tag color={config.color}>{status.count}</Tag>
                  </div>
                );
              })}
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <Text strong>Departments Involved:</Text>
                <Tag color="green">{byDepartment.length}</Tag>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <Text strong>Staff Members:</Text>
                <Tag color="purple">{byStaff.length}</Tag>
              </div>
              
              {byDepartment[0] && (
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <Text strong>Most Active Department:</Text>
                  <Tag color="orange">{byDepartment[0]?.department?.name}</Tag>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DepartmentLabStats;