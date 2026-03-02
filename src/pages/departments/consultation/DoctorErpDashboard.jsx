import React, { useEffect, useState } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Tag, Button, 
  Space, Progress, Typography, Spin, Badge, List, 
  Avatar, Timeline, Divider, message, Tabs, Empty
} from 'antd';
import { 
  UserOutlined, TeamOutlined, MedicineBoxOutlined, 
  ExperimentOutlined, FileTextOutlined, ClockCircleOutlined, 
  CheckCircleOutlined, ExclamationCircleOutlined, HeartOutlined,
  ArrowUpOutlined, CalendarOutlined, DollarOutlined, 
  SyncOutlined, RightOutlined, AlertOutlined, BellOutlined,
  HomeOutlined, CarOutlined, SendOutlined, EditOutlined,
  EyeOutlined, PlusOutlined, PrinterOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchActiveVisits, 
  fetchVisitByType 
} from '../../../redux/slice/recordSlice';
import { 
  fetchTestResults, 
  getLabStatistics,
  getRecentLabTests 
} from '../../../redux/slice/labSlice';
import { 
  fetchPrescriptions, 
  fetchPharmacyDashboardStats 
} from '../../../redux/slice/prescriptionSlice';
import { fetchDashboardStats } from '../../../redux/slice/dashboardSlice';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const DoctorErpDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Auth state
  const { user } = useSelector((state) => state.auth);
  
  // Record/Visit state - data is nested in activeVisits.data
  const recordsState = useSelector((state) => state.records);
  const activeVisitsData = recordsState?.activeVisits?.data || [];
  const visitsLoading = recordsState?.loading ?? false;
  
  // Lab state
  const { results: labResults, statistics: labStats, loading: labLoading } = useSelector((state) => state.lab);
  
  // Prescription state
  const { prescriptions, loading: prescriptionsLoading } = useSelector((state) => state.prescription);
  
  // Dashboard stats
  const { 
    todayPatients, admittedPatients, dischargedPatients, 
    labTests, prescriptions: dashboardPrescriptions 
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      await Promise.all([
        dispatch(fetchActiveVisits({})),
        dispatch(getRecentLabTests()),
        dispatch(fetchPrescriptions({})),
        dispatch(fetchDashboardStats({})),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter OPD patients (not admitted)
  const opdPatients = (Array.isArray(activeVisitsData) ? activeVisitsData : []).filter(visit => {
    return !visit?.on_admission && visit?.patient;
  });

  // Waiting patients (not started)
  const waitingPatients = opdPatients.filter(p => 
    p?.status === 'waiting' || p?.status === 'arrived'
  );

  // In progress
  const inProgressPatients = opdPatients.filter(p => 
    p?.status === 'in-progress' || p?.status === 'consulting'
  );

  // Completed today
  const completedPatients = opdPatients.filter(p => 
    p?.status === 'completed'
  );

  // Pending lab results
  const pendingLabResults = labResults?.filter(r => 
    r?.status === 'pending' || r?.status === 'in-progress'
  ) || [];

  // Recent prescriptions
  const recentPrescriptions = prescriptions?.slice(0, 5) || [];

  // Quick actions
  const quickActions = [
    { 
      key: 'new-patient', 
      title: 'New Patient', 
      icon: <UserOutlined />, 
      color: '#1890ff',
      path: '/shared/records'
    },
    { 
      key: 'queue', 
      title: 'Patient Queue', 
      icon: <TeamOutlined />, 
      color: '#52c41a',
      path: '/shared/consultation/waiting'
    },
    { 
      key: 'prescription', 
      title: 'Prescription', 
      icon: <MedicineBoxOutlined />, 
      color: '#722ed1',
      path: '/shared/departments/pharmacy'
    },
    { 
      key: 'lab-order', 
      title: 'Lab Order', 
      icon: <ExperimentOutlined />, 
      color: '#fa8c16',
      path: '/shared/lab/tests/pending'
    },
    { 
      key: 'admit', 
      title: 'Admit Patient', 
      icon: <HomeOutlined />, 
      color: '#eb2f96',
      path: '/shared/wards/bed-allocation'
    },
    { 
      key: 'referral', 
      title: 'Referral', 
      icon: <SendOutlined />, 
      color: '#13c2c2',
      path: '/shared/consultation/referrals'
    },
  ];

  // Patient queue columns
  const queueColumns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          waiting: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Waiting' },
          arrived: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Arrived' },
          'in-progress': { color: 'blue', icon: <SyncOutlined spin />, text: 'In Progress' },
          consulting: { color: 'blue', icon: <SyncOutlined spin />, text: 'Consulting' },
          completed: { color: 'green', icon: <CheckCircleOutlined />, text: 'Completed' },
        };
        const config = statusConfig[status] || statusConfig.waiting;
        return (
          <Tag color={config.color}>
            {config.icon} {config.text}
          </Tag>
        );
      }
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <div>
          <Text strong>
            {record.patient?.first_name} {record.patient?.middle_name} {record.patient?.last_name}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.patient?.folder_number}
          </Text>
        </div>
      ),
    },
    {
      title: 'Visit Type',
      dataIndex: 'visit_type',
      key: 'visit_type',
      render: (type) => <Tag>{type || 'General'}</Tag>,
    },
    {
      title: 'Time',
      key: 'time',
      render: (_, record) => (
        <Text type="secondary">
          {record.createdAt ? new Date(record.createdAt).toLocaleTimeString() : 'N/A'}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => navigate(`/shared/patient/details/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  // Lab results columns
  const labColumns = [
    {
      title: 'Test',
      dataIndex: 'test_name',
      key: 'test_name',
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <Text>{record.visit?.patient?.first_name} {record.visit?.patient?.last_name}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
  ];

  // Prescription columns
  const prescriptionColumns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <Text>{record.patient?.first_name} {record.patient?.last_name}</Text>
      ),
    },
    {
      title: 'Medications',
      dataIndex: 'medications',
      key: 'medications',
      render: (meds) => <Text>{meds?.length || 0} items</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'blue'}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="doctor-dashboard p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Doctor's Dashboard
            </Title>
            <Text type="secondary">
              Welcome, Dr. {user?.first_name || user?.username || 'Doctor'} | {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              icon={<SyncOutlined />} 
              onClick={loadDashboardData}
              loading={loading}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-0 shadow-sm rounded-xl" style={{ borderTop: '3px solid #1890ff' }}>
            <Statistic
              title={<span className="text-gray-500">OPD Patients Today</span>}
              value={opdPatients.length}
              prefix={<UserOutlined className="text-blue-500" />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {waitingPatients.length} waiting
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-0 shadow-sm rounded-xl" style={{ borderTop: '3px solid #fa8c16' }}>
            <Statistic
              title={<span className="text-gray-500">In Consultation</span>}
              value={inProgressPatients.length}
              prefix={<TeamOutlined className="text-orange-500" />}
              valueStyle={{ color: '#fa8c16' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Being attended
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-0 shadow-sm rounded-xl" style={{ borderTop: '3px solid #52c41a' }}>
            <Statistic
              title={<span className="text-gray-500">Completed</span>}
              value={completedPatients.length}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Finished today
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-0 shadow-sm rounded-xl" style={{ borderTop: '3px solid #722ed1' }}>
            <Statistic
              title={<span className="text-gray-500">Pending Lab Results</span>}
              value={pendingLabResults.length}
              prefix={<ExperimentOutlined className="text-purple-500" />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Awaiting results
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Secondary Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card size="small" className="border-0 shadow-sm">
            <Statistic 
              title={<span style={{ fontSize: 12 }}>Admitted</span>} 
              value={admittedPatients || 0} 
              prefix={<HomeOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="border-0 shadow-sm">
            <Statistic 
              title={<span style={{ fontSize: 12 }}>Discharged</span>} 
              value={dischargedPatients || 0} 
              prefix={<CarOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="border-0 shadow-sm">
            <Statistic 
              title={<span style={{ fontSize: 12 }}>Lab Tests</span>} 
              value={labTests || 0} 
              prefix={<ExperimentOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="border-0 shadow-sm">
            <Statistic 
              title={<span style={{ fontSize: 12 }}>Prescriptions</span>} 
              value={dashboardPrescriptions || 0} 
              prefix={<MedicineBoxOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <Row gutter={[16, 16]}>
          {quickActions.map((action) => (
            <Col xs={12} sm={8} md={4} key={action.key}>
              <Card 
                hoverable 
                className="text-center border-0 shadow-sm"
                onClick={() => navigate(action.path)}
                style={{ borderTop: `3px solid ${action.color}` }}
              >
                <div className="text-2xl mb-1" style={{ color: action.color }}>
                  {action.icon}
                </div>
                <div className="text-sm font-medium">{action.title}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Patient Queue */}
        <Col xs={24} lg={16}>
          <Card 
            className="border-0 shadow-sm rounded-xl"
            title={
              <div className="flex items-center justify-between">
                <span>Patient Queue</span>
                <Tag color="blue">{opdPatients.length} patients</Tag>
              </div>
            }
            extra={
              <Button type="link" onClick={() => navigate('/shared/consultation/waiting')}>
                View All <RightOutlined />
              </Button>
            }
          >
            {visitsLoading ? (
              <div className="flex justify-center items-center h-32">
                <Spin />
              </div>
            ) : opdPatients.length === 0 ? (
              <Empty description="No patients in queue" />
            ) : (
              <Table 
                columns={queueColumns} 
                dataSource={opdPatients.slice(0, 10)}
                rowKey="id"
                pagination={false}
                size="small"
              />
            )}
          </Card>

          {/* Lab & Prescription Tabs */}
          <Card 
            className="border-0 shadow-sm rounded-xl mt-4"
          >
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab={<span><ExperimentOutlined /> Lab Results</span>} key="lab">
                {labLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <Spin />
                  </div>
                ) : labResults?.length === 0 ? (
                  <Empty description="No lab results" />
                ) : (
                  <Table 
                    columns={labColumns} 
                    dataSource={labResults?.slice(0, 5) || []}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                )}
              </TabPane>
              <TabPane tab={<span><MedicineBoxOutlined /> Prescriptions</span>} key="prescription">
                {prescriptionsLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <Spin />
                  </div>
                ) : prescriptions?.length === 0 ? (
                  <Empty description="No prescriptions" />
                ) : (
                  <Table 
                    columns={prescriptionColumns} 
                    dataSource={prescriptions?.slice(0, 5) || []}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                )}
              </TabPane>
            </Tabs>
          </Card>
        </Col>

        {/* Right Sidebar */}
        <Col xs={24} lg={8}>
          {/* Today's Progress */}
          <Card className="border-0 shadow-sm rounded-xl mb-4">
            <h4 className="mb-4">Today's Progress</h4>
            <Progress 
              percent={opdPatients.length > 0 ? Math.round((completedPatients.length / opdPatients.length) * 100) : 0} 
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#52c41a',
              }}
            />
            <div className="text-sm text-gray-500 mt-2">
              {completedPatients.length} of {opdPatients.length} patients attended
            </div>
          </Card>

          {/* Recent Activity */}
          <Card 
            className="border-0 shadow-sm rounded-xl"
            title={<span>Recent Activity</span>}
          >
            <Timeline>
              {completedPatients.slice(0, 3).map((visit, index) => (
                <Timeline.Item key={index} color="green">
                  <Text strong>
                    {visit.patient?.first_name} {visit.patient?.last_name}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Consultation completed • {visit.updatedAt ? new Date(visit.updatedAt).toLocaleTimeString() : 'Just now'}
                  </Text>
                </Timeline.Item>
              ))}
              {inProgressPatients.slice(0, 2).map((visit, index) => (
                <Timeline.Item key={`inprogress-${index}`} color="blue">
                  <Text strong>
                    {visit.patient?.first_name} {visit.patient?.last_name}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    In consultation • Started {visit.updatedAt ? new Date(visit.updatedAt).toLocaleTimeString() : 'recently'}
                  </Text>
                </Timeline.Item>
              ))}
              {waitingPatients.slice(0, 2).map((visit, index) => (
                <Timeline.Item key={`waiting-${index}`} color="orange">
                  <Text strong>
                    {visit.patient?.first_name} {visit.patient?.last_name}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Waiting • {visit.createdAt ? new Date(visit.createdAt).toLocaleTimeString() : 'N/A'}
                  </Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>

          {/* Alerts */}
          <Card 
            className="border-0 shadow-sm rounded-xl mt-4"
            title={<span><AlertOutlined /> Alerts</span>}
          >
            <List
              size="small"
              dataSource={[
                { type: 'urgent', message: '3 patients need immediate attention' },
                { type: 'lab', message: `${pendingLabResults.length} lab results pending` },
                { type: 'prescription', message: '5 prescriptions awaiting review' },
              ]}
              renderItem={item => (
                <List.Item>
                  <div className="flex items-center">
                    <AlertOutlined 
                      className="mr-2" 
                      style={{ color: item.type === 'urgent' ? '#ff4d4f' : '#fa8c16' }} 
                    />
                    <Text>{item.message}</Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorErpDashboard;
