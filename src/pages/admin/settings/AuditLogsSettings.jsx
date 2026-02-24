import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  DatePicker,
  Typography,
  Row,
  Col,
  Statistic,
  Dropdown,
  Menu,
  Badge,
  Divider,
  Alert
} from 'antd';
import {
  SafetyCertificateOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  LoginOutlined,
  LogoutOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteRowOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AuditLogsSettings = () => {
  const user = useSelector((state) => state.auth.admin || state.auth.user);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);

  // Mock audit log data
  const [auditLogs, setAuditLogs] = useState([
    {
      id: '1',
      timestamp: '2024-01-15T10:30:00Z',
      user: 'Dr. John Smith',
      action: 'LOGIN',
      module: 'Authentication',
      description: 'User logged in successfully',
      ipAddress: '192.168.1.100',
      status: 'success'
    },
    {
      id: '2',
      timestamp: '2024-01-15T10:35:00Z',
      user: 'Nurse Mary',
      action: 'CREATE',
      module: 'Patient Records',
      description: 'New patient record created for John Doe',
      ipAddress: '192.168.1.105',
      status: 'success'
    },
    {
      id: '3',
      timestamp: '2024-01-15T10:40:00Z',
      user: 'Admin User',
      action: 'UPDATE',
      module: 'Settings',
      description: 'System settings updated',
      ipAddress: '192.168.1.110',
      status: 'success'
    },
    {
      id: '4',
      timestamp: '2024-01-15T10:45:00Z',
      user: 'Dr. Peter',
      action: 'DELETE',
      module: 'Prescription',
      description: 'Prescription deleted',
      ipAddress: '192.168.1.102',
      status: 'warning'
    },
    {
      id: '5',
      timestamp: '2024-01-15T11:00:00Z',
      user: 'Unknown',
      action: 'LOGIN',
      module: 'Authentication',
      description: 'Failed login attempt',
      ipAddress: '10.0.0.55',
      status: 'error'
    },
    {
      id: '6',
      timestamp: '2024-01-15T11:15:00Z',
      user: 'Accountant James',
      action: 'CREATE',
      module: 'Billing',
      description: 'Invoice created for patient #12345',
      ipAddress: '192.168.1.108',
      status: 'success'
    },
    {
      id: '7',
      timestamp: '2024-01-15T11:30:00Z',
      user: 'Admin User',
      action: 'EXPORT',
      module: 'Reports',
      description: 'Financial report exported',
      ipAddress: '192.168.1.110',
      status: 'success'
    },
    {
      id: '8',
      timestamp: '2024-01-15T11:45:00Z',
      user: 'Lab Tech Susan',
      action: 'UPDATE',
      module: 'Lab Results',
      description: 'Lab results updated for patient #54321',
      ipAddress: '192.168.1.115',
      status: 'success'
    }
  ]);

  const getActionIcon = (action) => {
    const icons = {
      LOGIN: <LoginOutlined />,
      LOGOUT: <LogoutOutlined />,
      CREATE: <PlusOutlined />,
      UPDATE: <EditOutlined />,
      DELETE: <DeleteRowOutlined />,
      EXPORT: <DownloadOutlined />,
      VIEW: <EyeOutlined />,
      LOGIN_FAILED: <WarningOutlined />
    };
    return icons[action] || <FileTextOutlined />;
  };

  const getStatusColor = (status) => {
    const colors = {
      success: 'green',
      warning: 'orange',
      error: 'red',
      info: 'blue'
    };
    return colors[status] || 'default';
  };

  const getActionColor = (action) => {
    const colors = {
      LOGIN: 'blue',
      LOGOUT: 'default',
      CREATE: 'green',
      UPDATE: 'orange',
      DELETE: 'red',
      EXPORT: 'purple',
      VIEW: 'cyan'
    };
    return colors[action] || 'default';
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => (
        <Space>
          <ClockCircleOutlined />
          {moment(timestamp).format('YYYY-MM-DD HH:mm:ss')}
        </Space>
      ),
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      defaultSortOrder: 'descend'
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user, record) => (
        <Space>
          <UserOutlined className="text-blue-500" />
          <div>
            <div>{user}</div>
            <Text type="secondary" className="text-xs">{record.ipAddress}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action) => (
        <Tag color={getActionColor(action)} icon={getActionIcon(action)}>
          {action}
        </Tag>
      )
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      render: (module) => (
        <Tag icon={<SettingOutlined />}>{module}</Tag>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={status === 'success' ? 'success' : status === 'error' ? 'error' : status === 'warning' ? 'warning' : 'processing'}
          text={status.toUpperCase()}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            size="small"
          >
            View
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            size="small"
            danger
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  const filteredLogs = auditLogs.filter(log => {
    let matches = true;
    
    if (searchText) {
      matches = matches && (
        log.user.toLowerCase().includes(searchText.toLowerCase()) ||
        log.description.toLowerCase().includes(searchText.toLowerCase()) ||
        log.module.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (actionFilter !== 'all') {
      matches = matches && log.action === actionFilter;
    }

    if (dateRange) {
      const logDate = moment(log.timestamp);
      matches = matches && logDate.isBetween(dateRange[0], dateRange[1], null, '[]');
    }

    return matches;
  });

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting audit logs...');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const stats = {
    totalLogs: auditLogs.length,
    loginAttempts: auditLogs.filter(l => l.action === 'LOGIN').length,
    failedAttempts: auditLogs.filter(l => l.status === 'error').length,
    modifications: auditLogs.filter(l => ['CREATE', 'UPDATE', 'DELETE'].includes(l.action)).length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Title level={2} className="text-gray-800 mb-2">
            <Space>
              <SafetyCertificateOutlined className="text-blue-500" />
              Audit Logs
            </Space>
          </Title>
          <Text type="secondary" className="text-lg">
            Track and monitor all system activities and user actions
          </Text>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card className="border-0 shadow-sm">
              <Statistic
                title="Total Logs"
                value={stats.totalLogs}
                prefix={<FileTextOutlined className="text-blue-500" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="border-0 shadow-sm">
              <Statistic
                title="Login Attempts"
                value={stats.loginAttempts}
                prefix={<LoginOutlined className="text-green-500" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="border-0 shadow-sm">
              <Statistic
                title="Failed Attempts"
                value={stats.failedAttempts}
                prefix={<WarningOutlined className="text-red-500" />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="border-0 shadow-sm">
              <Statistic
                title="Modifications"
                value={stats.modifications}
                prefix={<EditOutlined className="text-orange-500" />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters Card */}
        <Card className="border-0 shadow-sm mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Input
                placeholder="Search logs..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} md={6}>
              <Select
                placeholder="Filter by action"
                value={actionFilter}
                onChange={setActionFilter}
                style={{ width: '100%' }}
              >
                <Option value="all">All Actions</Option>
                <Option value="LOGIN">Login</Option>
                <Option value="LOGOUT">Logout</Option>
                <Option value="CREATE">Create</Option>
                <Option value="UPDATE">Update</Option>
                <Option value="DELETE">Delete</Option>
                <Option value="EXPORT">Export</Option>
              </Select>
            </Col>
            <Col xs={24} md={6}>
              <RangePicker
                style={{ width: '100%' }}
                onChange={setDateRange}
              />
            </Col>
            <Col xs={24} md={4}>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                >
                  Refresh
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                >
                  Export
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Audit Logs Table */}
        <Card className="border-0 shadow-sm">
          <Table
            columns={columns}
            dataSource={filteredLogs}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} logs`
            }}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys
            }}
          />
        </Card>

        {/* Retention Policy Info */}
        <Alert
          message="Log Retention Policy"
          description="Audit logs are retained for 90 days. Older logs are automatically archived. Contact administrator for log retention settings."
          type="info"
          showIcon
          className="mt-6"
        />
      </div>
    </div>
  );
};

export default AuditLogsSettings;

