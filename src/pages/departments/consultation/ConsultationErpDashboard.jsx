import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Tag, Button, 
  Input, Select, Tabs, Empty, Spin, Avatar, List, 
  Badge, Progress, Calendar, Divider, message 
} from 'antd';
import { 
  UserOutlined, TeamOutlined, MedicineBoxOutlined, 
  FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined,
  ExclamationCircleOutlined, HeartOutlined, AlertOutlined,
  BarChartOutlined, PlusOutlined, RightOutlined,
  CalendarOutlined, BookOutlined, ExperimentOutlined,
  SafetyCertificateOutlined, EditOutlined, EyeOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchActiveVisits } from '../../../redux/slice/recordSlice';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const ConsultationErpDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Get active visits data
  const recordsState = useSelector((state) => state.records);
  const activeVisitsData = recordsState?.activeVisits?.data || [];
  const loading = recordsState?.loading ?? false;

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('queue');

  useEffect(() => {
    dispatch(fetchActiveVisits());
  }, [dispatch]);

  // Filter out admitted patients and get consultation patients
  const consultationPatients = activeVisitsData.filter(visit => {
    if (visit.on_admission) return false;
    if (!visit || !visit.patient) return false;
    return true;
  });

  // Filter by search term
  const filteredPatients = consultationPatients.filter(visit => {
    const patient = visit.patient;
    const searchLower = searchTerm.toLowerCase();
    return (
      (patient?.first_name?.toLowerCase().includes(searchLower)) ||
      (patient?.last_name?.toLowerCase().includes(searchLower)) ||
      (patient?.middle_name?.toLowerCase().includes(searchLower)) ||
      (patient?.folder_number?.toLowerCase().includes(searchLower)) ||
      (visit?.attendance_number?.toLowerCase().includes(searchLower))
    );
  });

  // Statistics
  const today = new Date();
  const todayPatients = filteredPatients.length;
  const completedToday = Math.floor(todayPatients * 0.3); // Placeholder
  const waitingCount = todayPatients - completedToday;

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
      key: 'prescription', 
      title: 'Prescription', 
      icon: <MedicineBoxOutlined />, 
      color: '#52c41a',
      path: '/shared/departments/pharmacy'
    },
    { 
      key: 'lab-order', 
      title: 'Lab Order', 
      icon: <ExperimentOutlined />, 
      color: '#722ed1',
      path: '/shared/lab/tests/pending'
    },
    { 
      key: 'notes', 
      title: 'Doctor\'s Notes', 
      icon: <FileTextOutlined />, 
      color: '#faad14',
      path: '/shared/chat'
    },
  ];

  // Recent consultations
  const recentConsultations = filteredPatients.slice(0, 5).map((visit, index) => ({
    key: index,
    name: `${visit.patient?.first_name || ''} ${visit.patient?.last_name || ''}`.trim() || 'Unknown',
    folderNumber: visit.patient?.folder_number || 'N/A',
    attendanceNumber: visit.attendance_number || 'N/A',
    time: visit.createdAt ? new Date(visit.createdAt).toLocaleTimeString() : 'N/A',
    status: index < 2 ? 'waiting' : 'in-progress',
    priority: index === 0 ? 'urgent' : 'normal'
  }));

  // Patient queue columns
  const queueColumns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'waiting' ? 'orange' : 'blue'}>
          {status === 'waiting' ? <ClockCircleOutlined /> : <CheckCircleOutlined />} 
          {' '}{status}
        </Tag>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        priority === 'urgent' ? 
          <Tag color="red"><ExclamationCircleOutlined /> Urgent</Tag> : 
          <Tag color="default">Normal</Tag>
      )
    },
    {
      title: 'Patient Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Folder No.',
      dataIndex: 'folderNumber',
      key: 'folderNumber',
    },
    {
      title: 'Attendance No.',
      dataIndex: 'attendanceNumber',
      key: 'attendanceNumber',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/shared/patient/details/${record.key}`)}
        >
          <EyeOutlined /> View
        </Button>
      )
    },
  ];

  // Menu navigation items (for quick access cards)
  const menuItems = [
    {
      category: 'Patient Queue',
      items: [
        { label: 'OPD Patients', path: '/shared/consultation/opd', icon: <UserOutlined /> },
        { label: 'Waiting List', path: '#', icon: <ClockCircleOutlined /> },
        { label: 'In Progress', path: '#', icon: <TeamOutlined /> },
        { label: 'Completed Today', path: '#', icon: <CheckCircleOutlined /> },
      ]
    },
    {
      category: 'Clinical Records',
      items: [
        { label: 'Patient Diagnosis', path: '#', icon: <FileTextOutlined /> },
        { label: 'Complaints', path: '#', icon: <AlertOutlined /> },
        { label: 'Past Medical History', path: '#', icon: <BookOutlined /> },
        { label: 'Physical Examination', path: '#', icon: <HeartOutlined /> },
      ]
    },
    {
      category: 'Patient History',
      items: [
        { label: 'Allergies', path: '#', icon: <AlertOutlined /> },
        { label: 'Chronic Conditions', path: '#', icon: <HeartOutlined /> },
        { label: 'Drug History', path: '#', icon: <MedicineBoxOutlined /> },
        { label: 'Family Health History', path: '#', icon: <TeamOutlined /> },
      ]
    },
    {
      category: 'Doctor\'s Notes',
      items: [
        { label: 'All Notes', path: '#', icon: <FileTextOutlined /> },
        { label: 'Create Note', path: '#', icon: <EditOutlined /> },
        { label: 'Templates', path: '#', icon: <BookOutlined /> },
      ]
    },
    {
      category: 'Prescriptions',
      items: [
        { label: 'New Prescription', path: '/shared/departments/pharmacy', icon: <PlusOutlined /> },
        { label: 'Pending', path: '/shared/departments/pharmacy/pending', icon: <ClockCircleOutlined /> },
        { label: 'Completed', path: '#', icon: <CheckCircleOutlined /> },
      ]
    },
    {
      category: 'Vitals & Assessments',
      items: [
        { label: 'Record Vitals', path: '#', icon: <HeartOutlined /> },
        { label: 'Risk Assessment', path: '#', icon: <SafetyCertificateOutlined /> },
        { label: 'Wellness Score', path: '#', icon: <BarChartOutlined /> },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card className="border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-gray-500">Today's Patients</span>}
              value={todayPatients}
              prefix={<UserOutlined className="text-blue-500" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-gray-500">Waiting</span>}
              value={waitingCount}
              prefix={<ClockCircleOutlined className="text-orange-500" />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-gray-500">In Progress</span>}
              value={Math.floor(todayPatients * 0.4)}
              prefix={<TeamOutlined className="text-purple-500" />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-gray-500">Completed</span>}
              value={completedToday}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <Row gutter={[16, 16]}>
          {quickActions.map((action) => (
            <Col xs={12} sm={6} key={action.key}>
              <Card 
                hoverable 
                className="text-center border-0 shadow-sm"
                onClick={() => navigate(action.path)}
                style={{ borderTop: `3px solid ${action.color}` }}
              >
                <div className="text-3xl mb-2" style={{ color: action.color }}>
                  {action.icon}
                </div>
                <div className="font-medium">{action.title}</div>
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
              <div className="flex justify-between items-center">
                <span>Patient Queue</span>
                <Search
                  placeholder="Search patients..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: 250 }}
                  allowClear
                />
              </div>
            }
          >
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spin size="large" />
              </div>
            ) : filteredPatients.length === 0 ? (
              <Empty description="No patients in queue" />
            ) : (
              <Table 
                columns={queueColumns} 
                dataSource={recentConsultations}
                pagination={{ pageSize: 5 }}
                size="small"
              />
            )}
          </Card>
        </Col>

        {/* Quick Menu */}
        <Col xs={24} lg={8}>
          <Card 
            className="border-0 shadow-sm rounded-xl"
            title={<span>Consultation Menu</span>}
          >
            <Tabs activeKey={activeTab} onChange={setActiveTab} size="small">
              <TabPane tab="Queue" key="queue">
                <List
                  size="small"
                  dataSource={menuItems[0].items}
                  renderItem={item => (
                    <List.Item 
                      className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                      onClick={() => navigate(item.path)}
                    >
                      <div className="flex items-center">
                        <span className="mr-2 text-blue-500">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <RightOutlined className="text-gray-400" />
                    </List.Item>
                  )}
                />
              </TabPane>
              <TabPane tab="Clinical" key="clinical">
                <List
                  size="small"
                  dataSource={menuItems[1].items}
                  renderItem={item => (
                    <List.Item 
                      className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                      onClick={() => navigate(item.path)}
                    >
                      <div className="flex items-center">
                        <span className="mr-2 text-green-500">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <RightOutlined className="text-gray-400" />
                    </List.Item>
                  )}
                />
              </TabPane>
              <TabPane tab="History" key="history">
                <List
                  size="small"
                  dataSource={menuItems[2].items}
                  renderItem={item => (
                    <List.Item 
                      className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                      onClick={() => navigate(item.path)}
                    >
                      <div className="flex items-center">
                        <span className="mr-2 text-orange-500">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <RightOutlined className="text-gray-400" />
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </Card>

          {/* Today's Progress */}
          <Card className="border-0 shadow-sm rounded-xl mt-4">
            <h4 className="mb-4">Today's Progress</h4>
            <Progress 
              percent={Math.round((completedToday / Math.max(todayPatients, 1)) * 100)} 
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#52c41a',
              }}
            />
            <div className="text-sm text-gray-500 mt-2">
              {completedToday} of {todayPatients} patients attended
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ConsultationErpDashboard;

