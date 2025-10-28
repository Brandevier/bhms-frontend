import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getRecentLabTests } from '../../../../redux/slice/labSlice';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Tag,
  Input,
  Select,
  Space,
  Button,
  DatePicker,
  Tooltip,
  Spin,
  Empty,
  Typography,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  ReloadOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const RecentLabTests = () => {
  const { loading, results } = useSelector((state) => state.lab);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(getRecentLabTests());
  }, [dispatch]);

  useEffect(() => {
    if (results?.recentTests) {
      filterData();
    }
  }, [results, searchText, statusFilter, dateRange]);

  const filterData = () => {
    let filtered = results.recentTests;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(test =>
        test.template?.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        test.visit?.patient?.first_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        test.visit?.patient?.last_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        test.visit?.attendance_number?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(test => test.status === statusFilter);
    }

    // Date range filter
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      filtered = filtered.filter(test =>
        dayjs(test.createdAt).isBetween(start, end, 'day', '[]')
      );
    }

    setFilteredData(filtered);
  };

  const handleResetFilters = () => {
    setSearchText('');
    setStatusFilter('all');
    setDateRange([]);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      completed: 'green',
      cancelled: 'red',
      in_progress: 'blue'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      in_progress: 'In Progress'
    };
    return statusMap[status] || status;
  };

  const columns = [
    {
      title: 'Test Description',
      dataIndex: ['template', 'description'],
      key: 'description',
      width: 200,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Code: {record.template?.lab_tarrif?.g_drg_code}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Patient',
      dataIndex: ['visit', 'patient'],
      key: 'patient',
      width: 150,
      render: (patient) => (
        <Space direction="vertical" size={0}>
          <Text strong>{`${patient?.first_name} ${patient?.last_name}`}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {patient?.folder_number}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Attendance No.',
      dataIndex: ['visit', 'attendance_number'],
      key: 'attendance_number',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: 500 }}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Price (GHC)',
      dataIndex: ['template', 'lab_tarrif', 'tariff_ghc'],
      key: 'price',
      width: 100,
      align: 'right',
      render: (price) => `₵${parseFloat(price || 0).toFixed(2)}`,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      width: 150,
      render: (notes) => (
        <Tooltip title={notes}>
          <Text ellipsis style={{ maxWidth: 150 }}>
            {notes || '-'}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (test) => {
    navigate(`/shared/lab/visit/${test.visit_id}/tests`);
   
  };

  const statsData = filteredData.reduce(
    (acc, test) => {
      acc.total++;
      if (test.status === 'completed') acc.completed++;
      if (test.status === 'pending') acc.pending++;
      return acc;
    },
    { total: 0, completed: 0, pending: 0 }
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        <ExperimentOutlined /> Recent Lab Tests
      </Title>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Tests"
              value={statsData.total}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed"
              value={statsData.completed}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending"
              value={statsData.pending}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={statsData.total > 0 ? ((statsData.completed / statsData.total) * 100).toFixed(1) : 0}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters Card */}
      <Card
        style={{ marginBottom: 24 }}
        bodyStyle={{ paddingBottom: 8 }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Search tests, patients..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              enterButton
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              placeholder="Status"
            >
              <Option value="all">All Status</Option>
              <Option value="pending">Pending</Option>
              <Option value="completed">Completed</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={6} lg={5}>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={setDateRange}
              placeholder={['Start Date', 'End Date']}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={10}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={filterData}
                type="primary"
              >
                Apply Filters
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleResetFilters}
              >
                Reset
              </Button>
              <Text type="secondary">
                Showing {filteredData.length} of {results?.recentTests?.length || 0} tests
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Tests Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="No lab tests found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default RecentLabTests;