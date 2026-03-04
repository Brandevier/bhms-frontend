// PatientSummaryDashboard.jsx - ERP Dashboard for Records Department
import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Tag, Button, 
  Input, Select, Tabs, Empty, Spin, Avatar, List, 
  Badge, Progress, Divider, message, Tooltip, Modal
} from 'antd';
import { 
  UserOutlined, TeamOutlined, FileTextOutlined, 
  ClockCircleOutlined, CheckCircleOutlined, CalendarOutlined,
  ExclamationCircleOutlined, HeartOutlined, WomanOutlined,
  ManOutlined, PlusOutlined, RightOutlined, BarChartOutlined,
  PieChartOutlined, LineChartOutlined, DownloadOutlined,
  EditOutlined, ReloadOutlined, SettingOutlined,
  HomeOutlined, SearchOutlined, IdcardOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Import components from common folder
import SummaryCards from './common/SummaryCards';
import GenderChart from './common/GenderChart';
import AgeDistributionChart from './common/AgeDistributionChart';
import PatientTable from './common/PatientTable';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const PatientSummaryDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Mock data for ERP dashboard - in real app, this would come from Redux/slices
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Mock summary data
  const summaryData = {
    totalPatients: 1250,
    activePatients: 342,
    newPatients: 89,
    discharged: 156,
    inpatient: 45,
    outpatient: 297,
    male: 680,
    female: 570,
    ageGroups: {
      '0-17': 180,
      '18-35': 420,
      '36-50': 350,
      '51-65': 200,
      '65+': 100
    }
  };

  // Statistics for header cards
  const stats = [
    { 
      title: 'Total Patients', 
      value: summaryData.totalPatients, 
      icon: <UserOutlined />, 
      color: '#1890ff',
      trend: '+12%'
    },
    { 
      title: 'Active Cases', 
      value: summaryData.activePatients, 
      icon: <TeamOutlined />, 
      color: '#52c41a',
      trend: '+5%'
    },
    { 
      title: 'New Today', 
      value: summaryData.newPatients, 
      icon: <PlusOutlined />, 
      color: '#722ed1',
      trend: '+23%'
    },
    { 
      title: 'Discharged', 
      value: summaryData.discharged, 
      icon: <CheckCircleOutlined />, 
      color: '#fa8c16',
      trend: '-3%'
    }
  ];

  // Quick actions for ERP dashboard
  const quickActions = [
    { 
      key: 'new-patient', 
      title: 'New Patient', 
      icon: <UserOutlined />, 
      color: '#1890ff',
      path: '/shared/records/new'
    },
    { 
      key: 'active-patients', 
      title: 'Active Patients', 
      icon: <TeamOutlined />, 
      color: '#52c41a',
      path: '/shared/records/active'
    },
    { 
      key: 'all-records', 
      title: 'All Records', 
      icon: <FileTextOutlined />, 
      color: '#722ed1',
      path: '/shared/records/all'
    },
    { 
      key: 'reports', 
      title: 'Reports', 
      icon: <BarChartOutlined />, 
      color: '#fa8c16',
      path: '/shared/records/reports'
    },
  ];

  // Menu items for sidebar navigation
  const menuItems = [
    {
      category: 'Patient Records',
      items: [
        { label: 'New Patient Registration', path: '/shared/records/new', icon: <UserOutlined /> },
        { label: 'Active Patients', path: '/shared/records/active', icon: <TeamOutlined /> },
        { label: 'All Records', path: '/shared/records/all', icon: <FileTextOutlined /> },
        { label: 'Discharged Patients', path: '/shared/records/discharged', icon: <CheckCircleOutlined /> },
      ]
    },
    {
      category: 'Analytics',
      items: [
        { label: 'Patient Reports', path: '/shared/records/reports', icon: <BarChartOutlined /> },
        { label: 'Gender Distribution', path: '#', icon: <PieChartOutlined /> },
        { label: 'Age Distribution', path: '#', icon: <LineChartOutlined /> },
        { label: 'Monthly Trends', path: '#', icon: <CalendarOutlined /> },
      ]
    },
    {
      category: 'Quick Links',
      items: [
        { label: 'Search Patient', path: '/shared/records/search', icon: <SearchOutlined /> },
        { label: 'Update Records', path: '/shared/records/update', icon: <EditOutlined /> },
        { label: 'Export Data', path: '/shared/records/export', icon: <DownloadOutlined /> },
      ]
    },
  ];

  // Sample patient data for table
  const patientData = [
    { 
      key: '1', 
      name: 'John Doe', 
      age: 45, 
      gender: 'Male',
      folderNumber: 'F2024001',
      phone: '+233 20 123 4567',
      type: 'Inpatient',
      status: 'Active',
      department: 'General Medicine'
    },
    { 
      key: '2', 
      name: 'Jane Smith', 
      age: 32, 
      gender: 'Female',
      folderNumber: 'F2024002',
      phone: '+233 20 234 5678',
      type: 'Outpatient',
      status: 'Active',
      department: 'Consultation'
    },
    { 
      key: '3', 
      name: 'Michael Brown', 
      age: 58, 
      gender: 'Male',
      folderNumber: 'F2024003',
      phone: '+233 20 345 6789',
      type: 'Inpatient',
      status: 'Critical',
      department: 'Emergency'
    },
    { 
      key: '4', 
      name: 'Emily Davis', 
      age: 28, 
      gender: 'Female',
      folderNumber: 'F2024004',
      phone: '+233 20 456 7890',
      type: 'Outpatient',
      status: 'Active',
      department: 'Consultation'
    },
    { 
      key: '5', 
      name: 'David Wilson', 
      age: 65, 
      gender: 'Male',
      folderNumber: 'F2024005',
      phone: '+233 20 567 8901',
      type: 'Inpatient',
      status: 'Stable',
      department: 'Surgery'
    },
  ];

  // Table columns
  const columns = [
    {
      title: 'Folder No.',
      dataIndex: 'folderNumber',
      key: 'folderNumber',
      render: (text) => <Tag icon={<IdcardOutlined />}>{text}</Tag>
    },
    {
      title: 'Patient Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => (
        <Tag color={gender === 'Male' ? 'blue' : 'pink'} icon={gender === 'Male' ? <ManOutlined /> : <WomanOutlined />}>
          {gender}
        </Tag>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Inpatient' ? 'purple' : 'cyan'}>
          {type}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap = {
          'Active': 'green',
          'Critical': 'red',
          'Stable': 'blue',
          'Discharged': 'default'
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      }
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/shared/patient/details/${record.key}`)}>
          View Details
        </Button>
      )
    },
  ];

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success('Data refreshed successfully');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card className="border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <Statistic
                    title={<span className="text-gray-500 text-sm">{stat.title}</span>}
                    value={stat.value}
                    valueStyle={{ color: stat.color, fontWeight: 600 }}
                  />
                  <div className="text-xs mt-1">
                    <span className={stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                      {stat.trend}
                    </span>
                    <span className="text-gray-400 ml-1">vs last month</span>
                  </div>
                </div>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm rounded-xl mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold m-0">Quick Actions</h3>
          <div className="flex gap-2">
            <Tooltip title="Refresh Data">
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
            </Tooltip>
            <Tooltip title="Settings">
              <Button icon={<SettingOutlined />} />
            </Tooltip>
          </div>
        </div>
        <Row gutter={[16, 16]}>
          {quickActions.map((action) => (
            <Col xs={12} sm={6} key={action.key}>
              <Card 
                hoverable 
                className="text-center border-0 shadow-sm cursor-pointer"
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
        {/* Left Content - Charts and Tables */}
        <Col xs={24} lg={16}>
          {/* Charts Row */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} md={12}>
              <Card 
                className="border-0 shadow-sm rounded-xl"
                title={<span><PieChartOutlined className="mr-2" />Gender Distribution</span>}
              >
                {loading ? (
                  <div className="flex justify-center items-center h-48"><Spin /></div>
                ) : (
                  <GenderChart 
                    genderData={[
                      { name: 'Male', value: summaryData.male, color: '#1890ff' },
                      { name: 'Female', value: summaryData.female, color: '#eb2f96' }
                    ]} 
                  />
                )}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card 
                className="border-0 shadow-sm rounded-xl"
                title={<span><BarChartOutlined className="mr-2" />Age Distribution</span>}
              >
                {loading ? (
                  <div className="flex justify-center items-center h-48"><Spin /></div>
                ) : (
                  <AgeDistributionChart ageData={summaryData.ageGroups} />
                )}
              </Card>
            </Col>
          </Row>

          {/* Patient Table */}
          <Card 
            className="border-0 shadow-sm rounded-xl"
            title={
              <div className="flex justify-between items-center">
                <span><TeamOutlined className="mr-2" />Recent Patients</span>
                <Search
                  placeholder="Search patients..."
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  allowClear
                />
              </div>
            }
            extra={
              <Button type="link" onClick={() => navigate('/shared/records/active')}>
                View All <RightOutlined />
              </Button>
            }
          >
            {loading ? (
              <div className="flex justify-center items-center h-64"><Spin size="large" /></div>
            ) : (
              <Table 
                columns={columns} 
                dataSource={patientData}
                pagination={{ pageSize: 5 }}
                size="small"
              />
            )}
          </Card>
        </Col>

        {/* Right Sidebar - Menu */}
        <Col xs={24} lg={8}>
          <Card 
            className="border-0 shadow-sm rounded-xl"
            title={<span><HomeOutlined className="mr-2" />Records Menu</span>}
          >
            <Tabs activeKey={activeTab} onChange={setActiveTab} size="small">
              <TabPane tab="Records" key="records">
                <List
                  size="small"
                  dataSource={menuItems[0].items}
                  renderItem={item => (
                    <List.Item 
                      className="cursor-pointer hover:bg-gray-50 px-2 py-2 rounded transition-colors"
                      onClick={() => navigate(item.path)}
                    >
                      <div className="flex items-center w-full justify-between">
                        <div className="flex items-center">
                          <span className="mr-3 text-blue-500">{item.icon}</span>
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <RightOutlined className="text-gray-400 text-xs" />
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>
              <TabPane tab="Analytics" key="analytics">
                <List
                  size="small"
                  dataSource={menuItems[1].items}
                  renderItem={item => (
                    <List.Item 
                      className="cursor-pointer hover:bg-gray-50 px-2 py-2 rounded transition-colors"
                      onClick={() => navigate(item.path)}
                    >
                      <div className="flex items-center w-full justify-between">
                        <div className="flex items-center">
                          <span className="mr-3 text-green-500">{item.icon}</span>
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <RightOutlined className="text-gray-400 text-xs" />
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>
              <TabPane tab="Quick" key="quick">
                <List
                  size="small"
                  dataSource={menuItems[2].items}
                  renderItem={item => (
                    <List.Item 
                      className="cursor-pointer hover:bg-gray-50 px-2 py-2 rounded transition-colors"
                      onClick={() => navigate(item.path)}
                    >
                      <div className="flex items-center w-full justify-between">
                        <div className="flex items-center">
                          <span className="mr-3 text-orange-500">{item.icon}</span>
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <RightOutlined className="text-gray-400 text-xs" />
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </Card>

          {/* Summary Progress */}
          <Card className="border-0 shadow-sm rounded-xl mt-4">
            <h4 className="mb-4">Patient Overview</h4>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Inpatients</span>
                <span className="font-medium">{summaryData.inpatient} ({Math.round(summaryData.inpatient/summaryData.activePatients*100)}%)</span>
              </div>
              <Progress 
                percent={Math.round(summaryData.inpatient/summaryData.activePatients*100)} 
                strokeColor="#722ed1"
                showInfo={false}
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Outpatients</span>
                <span className="font-medium">{summaryData.outpatient} ({Math.round(summaryData.outpatient/summaryData.activePatients*100)}%))</span>
              </div>
              <Progress 
                percent={Math.round(summaryData.outpatient/summaryData.activePatients*100)} 
                strokeColor="#1890ff"
                showInfo={false}
              />
            </div>
            <Divider className="my-3" />
            <div className="text-sm text-gray-500">
              <div className="flex items-center mb-2">
                <ManOutlined className="mr-2 text-blue-500" />
                Male: {summaryData.male} patients
              </div>
              <div className="flex items-center">
                <WomanOutlined className="mr-2 text-pink-500" />
                Female: {summaryData.female} patients
              </div>
            </div>
          </Card>

          {/* Activity Log */}
          <Card 
            className="border-0 shadow-sm rounded-xl mt-4"
            title={<span><ClockCircleOutlined className="mr-2" />Recent Activity</span>}
          >
            <List
              size="small"
              dataSource={[
                { action: 'New patient registered', time: '2 mins ago', icon: <UserOutlined className="text-blue-500" /> },
                { action: 'Patient discharged', time: '15 mins ago', icon: <CheckCircleOutlined className="text-green-500" /> },
                { action: 'Record updated', time: '32 mins ago', icon: <FileTextOutlined className="text-orange-500" /> },
                { action: 'New admission', time: '1 hour ago', icon: <TeamOutlined className="text-purple-500" /> },
              ]}
              renderItem={item => (
                <List.Item className="py-2">
                  <div className="flex items-center w-full">
                    <div className="mr-3 text-lg">{item.icon}</div>
                    <div>
                      <div className="text-sm">{item.action}</div>
                      <div className="text-xs text-gray-400">{item.time}</div>
                    </div>
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

export default PatientSummaryDashboard;

