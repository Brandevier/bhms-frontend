// ERP Admin Dashboard - Main Component
import React, { useEffect } from "react";
import { 
  Row, Col, Card, Statistic, Table, Tag, Button, 
  Space, Progress, Typography,
  Select, Spin, Tooltip, message
} from "antd";
import { 
  ArrowUpOutlined, UserOutlined, 
  DollarOutlined, CalendarOutlined, MedicineBoxOutlined,
  TeamOutlined, HomeOutlined, FileTextOutlined,
  SettingOutlined, SyncOutlined,
  ClockCircleOutlined, CheckCircleOutlined,
  CloudUploadOutlined, DatabaseOutlined, DashboardOutlined,
  BarChartOutlined, PieChartOutlined,
  SafetyOutlined, InfoCircleOutlined, ExperimentOutlined
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { fetchAllDashboardData, setMockData, createBackup } from "../../redux/slice/dashboardSlice";
import { fetchAllDashboardData, setMockData, createBackup } from "../../../../redux/slice/dashboardSlice";
import './ErpDashboard.css';

const { Title, Text } = Typography;
const { Option } = Select;

const ErpDashboard = () => {
  const { admin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = React.useState("today");
  
  // Get dashboard state from Redux
  const {
    totalPatients,
    totalRevenue,
    totalAppointments,
    bedOccupancy,
    totalDepartments,
    totalStaff,
    pendingBills,
    todayPatients,
    monthlyRevenue,
    admittedPatients,
    dischargedPatients,
    labTests,
    prescriptions,
    revenueTrends,
    departmentPerformance,
    recentActivities,
    upcomingAppointments,
    systemHealth,
    backupStatus,
    loading,
    error
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = () => {
    const institutionId = admin?.institution?.id;
    dispatch(fetchAllDashboardData({ 
      institution_id: institutionId, 
      period: timeRange 
    })).then((result) => {
      if (result.error) {
        // On error, set mock data for demo
        dispatch(setMockData());
        message.warning('Using demo data. Server may be unavailable.');
      }
    });
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleBackup = () => {
    dispatch(createBackup({})).then((result) => {
      if (!result.error) {
        message.success('Backup created successfully');
        loadDashboardData();
      } else {
        message.error('Failed to create backup');
      }
    });
  };

  // Format currency helper
  const formatCurrency = (value) => {
    if (!value) return '$0';
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#52c41a';
      case 'warning': return '#faad14';
      case 'critical': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  // Quick action handlers
  const handleQuickAction = (action) => {
    switch (action) {
      case 'newPatient':
        navigate('/shared/departments/records/new');
        break;
      case 'newAppointment':
        navigate('/admin/appointments');
        break;
      case 'billing':
        navigate('/shared/departments/accounts');
        break;
      case 'reports':
        navigate('/admin/reports');
        break;
      case 'staff':
        navigate('/admin/staffs');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: 'Patient',
      dataIndex: 'patient',
      key: 'patient',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 100,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status?.toUpperCase()}</Tag>
      ),
    },
  ];

  const activityColumns = [
    {
      title: 'Activity',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <Space>
          <Badge color={record.color} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 120,
      render: (time) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>{time}</Text>
      ),
    },
  ];

  // Stats object for easier access
  const stats = {
    totalPatients: totalPatients || 0,
    totalRevenue: totalRevenue || 0,
    totalAppointments: totalAppointments || 0,
    bedOccupancy: bedOccupancy || 0,
    totalDepartments: totalDepartments || 0,
    totalStaff: totalStaff || 0,
    pendingBills: pendingBills || 0,
    todayPatients: todayPatients || 0,
    monthlyRevenue: monthlyRevenue || 0,
    admittedPatients: admittedPatients || 0,
    dischargedPatients: dischargedPatients || 0,
    labTests: labTests || 0,
    prescriptions: prescriptions || 0
  };

  if (loading) {
    return (
      <div className="erp-loading-container">
        <Spin size="large" />
        <Text>Loading Dashboard...</Text>
      </div>
    );
  }

  return (
    <div className="erp-dashboard">
      {/* Header Section */}
      <div className="erp-dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <DashboardOutlined className="header-icon" />
            <div>
              <Title level={3} style={{ margin: 0 }}>Hospital ERP Dashboard</Title>
              <Text type="secondary">
                Welcome back, {admin?.username || 'Administrator'} | {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </div>
          </div>
          <div className="header-actions">
            <Select 
              value={timeRange} 
              onChange={setTimeRange}
              style={{ width: 150 }}
            >
              <Option value="today">Today</Option>
              <Option value="week">This Week</Option>
              <Option value="month">This Month</Option>
              <Option value="year">This Year</Option>
            </Select>
            <Button icon={<SyncOutlined />} onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} className="kpi-cards">
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card revenue-card">
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              formatter={(value) => formatCurrency(value)}
              prefix={<DollarOutlined />}
              suffix={<ArrowUpOutlined style={{ color: '#52c41a', fontSize: 14 }} />}
            />
            <Text type="secondary">+12.5% from last month</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card patients-card">
            <Statistic
              title="Total Patients"
              value={stats.totalPatients}
              prefix={<UserOutlined />}
              suffix={<ArrowUpOutlined style={{ color: '#52c41a', fontSize: 14 }} />}
            />
            <Text type="secondary">{stats.todayPatients} new today</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card appointments-card">
            <Statistic
              title="Appointments"
              value={stats.totalAppointments}
              prefix={<CalendarOutlined />}
            />
            <Text type="secondary">{stats.totalAppointments} scheduled</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card beds-card">
            <Statistic
              title="Bed Occupancy"
              value={stats.bedOccupancy}
              prefix={<HomeOutlined />}
              suffix="%"
              valueStyle={{ color: stats.bedOccupancy > 80 ? '#ff4d4f' : '#52c41a' }}
            />
            <Progress 
              percent={stats.bedOccupancy} 
              showInfo={false} 
              strokeColor={stats.bedOccupancy > 80 ? '#ff4d4f' : '#52c41a'}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Secondary Stats Row */}
      <Row gutter={[16, 16]} className="secondary-stats">
        <Col xs={12} sm={6}>
          <Card size="small" className="mini-stat-card">
            <Statistic 
              title="Admitted" 
              value={stats.admittedPatients} 
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="mini-stat-card">
            <Statistic 
              title="Discharged" 
              value={stats.dischargedPatients} 
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="mini-stat-card">
            <Statistic 
              title="Lab Tests" 
              value={stats.labTests} 
              prefix={<ExperimentOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="mini-stat-card">
            <Statistic 
              title="Prescriptions" 
              value={stats.prescriptions} 
              prefix={<MedicineBoxOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="quick-actions-card" title="Quick Actions">
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={4}>
            <Button 
              type="primary" 
              icon={<UserOutlined />} 
              onClick={() => handleQuickAction('newPatient')}
              block
              className="quick-action-btn"
            >
              New Patient
            </Button>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Button 
              type="primary" 
              icon={<CalendarOutlined />} 
              onClick={() => handleQuickAction('newAppointment')}
              block
              className="quick-action-btn"
            >
              Appointment
            </Button>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Button 
              type="primary" 
              icon={<DollarOutlined />} 
              onClick={() => handleQuickAction('billing')}
              block
              className="quick-action-btn"
            >
              Billing
            </Button>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Button 
              icon={<FileTextOutlined />} 
              onClick={() => handleQuickAction('reports')}
              block
              className="quick-action-btn"
            >
              Reports
            </Button>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Button 
              icon={<TeamOutlined />} 
              onClick={() => handleQuickAction('staff')}
              block
              className="quick-action-btn"
            >
              Staff
            </Button>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Button 
              icon={<SettingOutlined />} 
              onClick={() => handleQuickAction('settings')}
              block
              className="quick-action-btn"
            >
              Settings
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Main Content Grid */}
      <Row gutter={[16, 16]} className="main-content">
        {/* Left Column */}
        <Col xs={24} lg={16}>
          {/* Revenue Chart Card */}
          <Card 
            className="chart-card" 
            title={
              <Space>
                <BarChartOutlined />
                Revenue Overview
              </Space>
            }
            extra={
              <Select defaultValue="revenue" style={{ width: 120 }}>
                <Option value="revenue">Revenue</Option>
                <Option value="expenses">Expenses</Option>
                <Option value="profit">Profit</Option>
              </Select>
            }
          >
            <div className="chart-placeholder">
              <Row gutter={16}>
                {revenueTrends && revenueTrends.map((item, index) => (
                  <Col span={4} key={index} className="chart-bar-container">
                    <div className="chart-bar-wrapper">
                      <div 
                        className="chart-bar revenue-bar" 
                        style={{ height: `${(item.revenue / 1500000) * 100}%` }}
                      >
                        <Tooltip title={`Revenue: ${formatCurrency(item.revenue)}`}>
                          <span className="bar-value">{formatCurrency(item.revenue)}</span>
                        </Tooltip>
                      </div>
                      <div 
                        className="chart-bar expense-bar" 
                        style={{ height: `${(item.expenses / 1500000) * 100}%` }}
                      >
                        <Tooltip title={`Expenses: ${formatCurrency(item.expenses)}`}>
                          <span className="bar-value">{formatCurrency(item.expenses)}</span>
                        </Tooltip>
                      </div>
                    </div>
                    <Text className="chart-label">{item.month}</Text>
                  </Col>
                ))}
              </Row>
              <div className="chart-legend">
                <Space>
                  <span className="legend-item"><span className="legend-color revenue"></span> Revenue</span>
                  <span className="legend-item"><span className="legend-color expense"></span> Expenses</span>
                </Space>
              </div>
            </div>
          </Card>

          {/* Department Performance */}
          <Card 
            className="department-card" 
            title={
              <Space>
                <PieChartOutlined />
                Department Performance
              </Space>
            }
          >
            <Table
              dataSource={departmentPerformance}
              pagination={false}
              rowKey="name"
              size="small"
              columns={[
                {
                  title: 'Department',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text) => <Text strong>{text}</Text>,
                },
                {
                  title: 'Patients',
                  dataIndex: 'patients',
                  key: 'patients',
                  align: 'center',
                },
                {
                  title: 'Revenue',
                  dataIndex: 'revenue',
                  key: 'revenue',
                  align: 'right',
                  render: (value) => formatCurrency(value),
                },
                {
                  title: 'Efficiency',
                  dataIndex: 'efficiency',
                  key: 'efficiency',
                  align: 'center',
                  render: (value) => (
                    <Progress 
                      percent={value} 
                      size="small" 
                      strokeColor={value > 90 ? '#52c41a' : value > 70 ? '#faad14' : '#ff4d4f'}
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={8}>
          {/* Upcoming Appointments */}
          <Card 
            className="appointments-card" 
            title={
              <Space>
                <CalendarOutlined />
                Upcoming Appointments
              </Space>
            }
            extra={<Button type="link" onClick={() => navigate('/admin/appointments')}>View All</Button>}
          >
            <Table
              dataSource={upcomingAppointments}
              columns={columns}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>

          {/* Recent Activity */}
          <Card 
            className="activity-card" 
            title={
              <Space>
                <ClockCircleOutlined />
                Recent Activity
              </Space>
            }
          >
            <Table
              dataSource={recentActivities}
              columns={activityColumns}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      {/* System Health & Backup Row */}
      <Row gutter={[16, 16]} className="system-row">
        {/* System Health */}
        <Col xs={24} md={12}>
          <Card 
            className="system-health-card" 
            title={
              <Space>
                <SafetyOutlined />
                System Health
              </Space>
            }
          >
            <Row gutter={16}>
              <Col span={8}>
                <div className="health-item">
                  <div 
                    className="health-indicator" 
                    style={{ backgroundColor: getHealthStatusColor(systemHealth?.database) }}
                  />
                  <Text>Database</Text>
                  <Text type="secondary" style={{ textTransform: 'capitalize' }}>{systemHealth?.database}</Text>
                </div>
              </Col>
              <Col span={8}>
                <div className="health-item">
                  <div 
                    className="health-indicator" 
                    style={{ backgroundColor: getHealthStatusColor(systemHealth?.api) }}
                  />
                  <Text>API</Text>
                  <Text type="secondary" style={{ textTransform: 'capitalize' }}>{systemHealth?.api}</Text>
                </div>
              </Col>
              <Col span={8}>
                <div className="health-item">
                  <div 
                    className="health-indicator" 
                    style={{ backgroundColor: getHealthStatusColor(systemHealth?.storage) }}
                  />
                  <Text>Storage</Text>
                  <Text type="secondary" style={{ textTransform: 'capitalize' }}>{systemHealth?.storage}</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Backup Status */}
        <Col xs={24} md={12}>
          <Card 
            className="backup-card" 
            title={
              <Space>
                <DatabaseOutlined />
                Backup & Storage
              </Space>
            }
            extra={
              <Button 
                type="primary" 
                icon={<CloudUploadOutlined />}
                size="small"
                onClick={handleBackup}
              >
                Backup Now
              </Button>
            }
          >
            <Row gutter={16}>
              <Col span={12}>
                <div className="backup-item">
                  <ClockCircleOutlined />
                  <div>
                    <Text type="secondary">Last Backup</Text>
                    <Text strong>
                      {backupStatus?.lastBackup 
                        ? new Date(backupStatus.lastBackup).toLocaleString()
                        : 'Never'
                      }
                    </Text>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="backup-item">
                  <DatabaseOutlined />
                  <div>
                    <Text type="secondary">Available Backups</Text>
                    <Text strong>{backupStatus?.backupsAvailable || 0} files</Text>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="backup-item">
                  <InfoCircleOutlined />
                  <div>
                    <Text type="secondary">Total Size</Text>
                    <Text strong>{backupStatus?.totalSize || '0 MB'}</Text>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="backup-item">
                  <CalendarOutlined />
                  <div>
                    <Text type="secondary">Next Scheduled</Text>
                    <Text strong>
                      {backupStatus?.nextScheduled 
                        ? new Date(backupStatus.nextScheduled).toLocaleString()
                        : 'Not set'
                      }
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ErpDashboard;

