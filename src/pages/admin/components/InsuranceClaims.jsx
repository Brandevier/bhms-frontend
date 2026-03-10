import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, Tag, Card, Button, Input, Select, DatePicker, Modal, Progress, 
  Avatar, Badge, message, Row, Col, Statistic, Space, Typography, Tabs, 
  Drawer, Form, Tooltip, Popconfirm, Spin, Divider, Empty, Alert
} from 'antd';
import { 
  SearchOutlined, 
  FileExcelOutlined, 
  FilePdfOutlined,
  FileTextOutlined,
  DownloadOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  RobotOutlined,
  PlusOutlined,
  DollarOutlined,
  EyeOutlined,
  EditOutlined,
  FilterOutlined,
  ReloadOutlined,
  FileDoneOutlined,
  BarChartOutlined,
  PieChartOutlined,
  UnorderedListOutlined,
  ExportOutlined,
  SettingOutlined,
  CalendarOutlined,
  PrinterOutlined,
  SyncOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  BankOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  AuditOutlined,
  WarningOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Base URL for API
const BASE_URL = 'http://localhost:4000/api/v1'; 

// Status colors mapping
const statusColors = {
  Approved: 'green',
  Pending: 'blue',
  Rejected: 'red',
  Submitted: 'orange'
};

const paymentStatusColors = {
  paid: 'green',
  pending: 'blue',
  rejected: 'red',
  processing: 'orange'
};

const serviceTypeColors = {
  Inpatient: 'purple',
  Outpatient: 'blue',
  Surgery: 'red',
  Maternity: 'pink',
  Laboratory: 'cyan',
  Pharmacy: 'orange'
};

// Format currency
const formatCurrency = (value) => {
  if (!value) return 'GHS 0.00';
  return `GHS ${parseFloat(value).toFixed(2)}`;
};

// Get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const InsuranceClaims = () => {
  const { admin } = useSelector((state) => state.auth);
  
  // State for dashboard data
  const [summary, setSummary] = useState({
    totalClaims: 0,
    totalAmount: 0,
    statusBreakdown: { approved: 0, rejected: 0, pending: 0, submitted: 0 }
  });
  const [recentClaims, setRecentClaims] = useState([]);
  const [itemsBreakdown, setItemsBreakdown] = useState([]);
  
  // State for claims list
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10
  });
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  
  // UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsDrawerVisible, setIsDetailsDrawerVisible] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [submittingBatch, setSubmittingBatch] = useState(false);
  
  // Form for claim update
  const [form] = Form.useForm();

  // Fetch dashboard summary
  const fetchDashboardSummary = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/claims/dashboard/summary`, {
        headers: getAuthHeader()
      });
      if (response.data) {
        setSummary({
          totalClaims: response.data.totalClaims || 0,
          totalAmount: response.data.totalAmount || 0,
          statusBreakdown: response.data.statusBreakdown || { approved: 0, rejected: 0, pending: 0, submitted: 0 }
        });
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  }, []);

  // Fetch recent claims
  const fetchRecentClaims = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/claims/dashboard/recent`, {
        headers: getAuthHeader()
      });
      if (response.data) {
        setRecentClaims(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching recent claims:', error);
      setRecentClaims([]);
    }
  }, []);

  // Fetch items breakdown
  const fetchItemsBreakdown = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/claims/dashboard/items-breakdown`, {
        headers: getAuthHeader()
      });
      if (response.data) {
        setItemsBreakdown(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching items breakdown:', error);
      setItemsBreakdown([]);
    }
  }, []);

  // Fetch all claims with pagination
  const fetchClaims = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      if (dateRange && dateRange[0]) params.append('startDate', dateRange[0].toISOString());
      if (dateRange && dateRange[1]) params.append('endDate', dateRange[1].toISOString());

      const response = await axios.get(`${BASE_URL}/claims/all-visits?${params.toString()}`, {
        headers: getAuthHeader()
      });
      
      if (response.data) {
        setClaims(Array.isArray(response.data.data) ? response.data.data : []);
        setPagination({
          currentPage: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 0,
          totalItems: response.data.pagination?.totalItems || 0,
          itemsPerPage: response.data.pagination?.itemsPerPage || 10
        });
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
      message.error('Failed to load claims');
      setClaims([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm, dateRange]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardSummary();
    fetchRecentClaims();
    fetchItemsBreakdown();
    fetchClaims();
  }, [fetchDashboardSummary, fetchRecentClaims, fetchItemsBreakdown, fetchClaims]);

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchClaims(1, pagination.itemsPerPage);
  };

  // Handle status filter
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    fetchClaims(1, pagination.itemsPerPage);
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates || []);
    fetchClaims(1, pagination.itemsPerPage);
  };

  // Handle view details
  const handleViewDetails = async (record) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/claims/${record.id}`, {
        headers: getAuthHeader()
      });
      setSelectedClaim(response.data.data || record);
    } catch (error) {
      setSelectedClaim(record);
    } finally {
      setLoading(false);
      setIsDetailsDrawerVisible(true);
    }
  };

  // Handle update claim status
  const handleUpdateStatus = async (claimId, newStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/claims/update-claim-status`,
        { claim_id: claimId, claim_status: newStatus },
        { headers: getAuthHeader() }
      );
      message.success(`Claim ${newStatus.toLowerCase()} successfully`);
      fetchClaims(pagination.currentPage, pagination.itemsPerPage);
      fetchDashboardSummary();
      fetchRecentClaims();
      setIsDetailsDrawerVisible(false);
    } catch (error) {
      message.error('Failed to update claim status');
    }
  };

  // Handle export to Excel
  const handleExportExcel = async () => {
    setLoading(true);
    try {
      // Fetch all claims for export
      const params = new URLSearchParams();
      params.append('page', 1);
      params.append('limit', 1000);
      
      const response = await axios.get(`${BASE_URL}/claims/all-visits?${params.toString()}`, {
        headers: getAuthHeader()
      });
      
      const dataToExport = Array.isArray(response.data.data) ? response.data.data : claims;
      
      if (dataToExport.length === 0) {
        message.warning('No data to export');
        return;
      }

      const exportData = dataToExport.map(claim => ({
        'Claim ID': claim.claim_reference_number || claim.id,
        'Patient Name': claim.visit?.patient ? 
          `${claim.visit.patient.first_name || ''} ${claim.visit.patient.last_name || ''}`.trim() : 
          'N/A',
        'NHIS ID': claim.visit?.patient?.nhis_number || 'N/A',
        'Service Date': claim.visit?.visit_date ? dayjs(claim.visit.visit_date).format('DD/MM/YYYY') : 'N/A',
        'Service Type': claim.visit?.visit_type || 'N/A',
        'Diagnosis': claim.items?.[0]?.diagnosis?.diagnosis_name || 'N/A',
        'Diagnosis Code': claim.items?.[0]?.diagnosis?.icd10_code || 'N/A',
        'Amount (GHS)': claim.total_amount || 0,
        'Status': claim.claim_status || 'N/A',
        'Submission Date': claim.submission_date ? dayjs(claim.submission_date).format('DD/MM/YYYY') : 'N/A'
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'NHIS Claims');
      
      // Set column widths
      worksheet['!cols'] = [
        { wch: 30 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
        { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 15 },
        { wch: 15 }, { wch: 15 }
      ];
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `NHIS_Claims_Export_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
      
      message.success('Excel file exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  // Handle batch submission
  const handleBatchSubmit = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select claims to submit');
      return;
    }

    setSubmittingBatch(true);
    try {
      // In a real implementation, this would create a batch and submit
      message.success(`Batch created for ${selectedRowKeys.length} claims`);
      setSelectedRowKeys([]);
      fetchDashboardSummary();
      fetchRecentClaims();
    } catch (error) {
      message.error('Failed to create batch');
    } finally {
      setSubmittingBatch(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboardSummary();
    fetchRecentClaims();
    fetchItemsBreakdown();
    fetchClaims(pagination.currentPage, pagination.itemsPerPage);
    message.success('Data refreshed');
  };

  // Table columns for claims list
  const columns = [
    {
      title: 'Claim ID',
      dataIndex: 'claim_reference_number',
      key: 'claim_reference_number',
      render: (ref, record) => (
        <span className="font-mono text-xs">{ref || record.id?.slice(0, 8)}</span>
      ),
      width: 150
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar size="small" icon={<UserOutlined />} className="mr-2 bg-blue-100" />
          <div>
            <div className="font-medium text-sm">
              {record.visit?.patient ? 
                `${record.visit.patient.first_name || ''} ${record.visit.patient.last_name || ''}`.trim() : 
                'N/A'}
            </div>
            <div className="text-gray-500 text-xs">{record.visit?.patient?.nhis_number || 'No NHIS'}</div>
          </div>
        </div>
      ),
      width: 200
    },
    {
      title: 'Service Date',
      dataIndex: ['visit', 'visit_date'],
      key: 'serviceDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A',
      sorter: true,
      width: 120
    },
    {
      title: 'Service Type',
      dataIndex: ['visit', 'visit_type'],
      key: 'serviceType',
      render: (type) => <Tag color={serviceTypeColors[type] || 'default'}>{type || 'N/A'}</Tag>,
      width: 120
    },
    {
      title: 'Diagnosis',
      key: 'diagnosis',
      render: (_, record) => {
        const diagnosis = record.items?.[0]?.diagnosis;
        return (
          <div>
            <div className="text-sm">{diagnosis?.diagnosis_name || 'N/A'}</div>
            <div className="text-gray-500 text-xs">{diagnosis?.icd10_code || ''}</div>
          </div>
        );
      },
      width: 180
    },
    {
      title: 'Amount',
      dataIndex: 'total_amount',
      key: 'amount',
      render: (amount) => <span className="font-medium">{formatCurrency(amount)}</span>,
      align: 'right',
      sorter: true,
      width: 120
    },
    {
      title: 'Status',
      dataIndex: 'claim_status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status] || 'default'}>
          {status?.toUpperCase() || 'N/A'}
        </Tag>
      ),
      width: 100
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetails(record)}
              size="small"
            />
          </Tooltip>
          {record.claim_status === 'Pending' && (
            <>
              <Tooltip title="Approve">
                <Button 
                  type="text" 
                  icon={<CheckCircleOutlined />} 
                  onClick={() => handleUpdateStatus(record.id, 'Approved')}
                  size="small"
                  className="text-green-500"
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button 
                  type="text" 
                  icon={<CloseCircleOutlined />} 
                  onClick={() => handleUpdateStatus(record.id, 'Rejected')}
                  size="small"
                  className="text-red-500"
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
      width: 100
    },
  ];

  // Row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record) => ({
      disabled: record.claim_status !== 'Pending',
    }),
  };

  // Dashboard Tab Content
  const renderDashboardTab = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Claims"
              value={summary.totalClaims}
              prefix={<FileTextOutlined className="text-blue-500" />}
              suffix={<span className="text-xs text-gray-500 ml-2">all time</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Pending Approval"
              value={summary.statusBreakdown.pending}
              prefix={<ClockCircleOutlined className="text-orange-500" />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Approved"
              value={summary.statusBreakdown.approved}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Value"
              value={summary.totalAmount}
              prefix={<DollarOutlined className="text-purple-500" />}
              formatter={(value) => formatCurrency(value)}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title={<Space><BarChartOutlined /> Recent Claims</Space>}
            className="shadow-sm"
            extra={<Button type="link" onClick={() => setActiveTab('claims')}>View All</Button>}
          >
            {recentClaims.length > 0 ? (
              <Table
                dataSource={recentClaims.slice(0, 5)}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: 'Claim',
                    key: 'claim',
                    render: (_, record) => (
                      <div>
                        <div className="font-medium">{record.claim_reference_number?.slice(0, 12)}...</div>
                        <Text type="secondary" className="text-xs">
                          {record.visit?.patient?.first_name} {record.visit?.patient?.last_name}
                        </Text>
                      </div>
                    ),
                  },
                  {
                    title: 'Amount',
                    dataIndex: 'total_amount',
                    key: 'amount',
                    render: (val) => formatCurrency(val),
                    align: 'right',
                  },
                  {
                    title: 'Status',
                    dataIndex: 'claim_status',
                    key: 'status',
                    render: (status) => (
                      <Tag color={statusColors[status]}>{status}</Tag>
                    ),
                  },
                  {
                    title: 'Date',
                    key: 'date',
                    render: (_, record) => (
                      <Text type="secondary" className="text-xs">
                        {record.createdAt ? dayjs(record.createdAt).format('DD/MM/YY') : 'N/A'}
                      </Text>
                    ),
                  },
                ]}
              />
            ) : (
              <Empty description="No recent claims" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<Space><PieChartOutlined /> Claims by Status</Space>}
            className="shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Space>
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <Text>Pending</Text>
                </Space>
                <Text strong>{summary.statusBreakdown.pending}</Text>
              </div>
              <Progress 
                percent={summary.totalClaims > 0 ? (summary.statusBreakdown.pending / summary.totalClaims * 100).toFixed(1) : 0} 
                strokeColor="#fa8c16"
                showInfo={false}
              />
              
              <div className="flex justify-between items-center">
                <Space>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <Text>Approved</Text>
                </Space>
                <Text strong>{summary.statusBreakdown.approved}</Text>
              </div>
              <Progress 
                percent={summary.totalClaims > 0 ? (summary.statusBreakdown.approved / summary.totalClaims * 100).toFixed(1) : 0} 
                strokeColor="#52c41a"
                showInfo={false}
              />
              
              <div className="flex justify-between items-center">
                <Space>
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <Text>Rejected</Text>
                </Space>
                <Text strong>{summary.statusBreakdown.rejected}</Text>
              </div>
              <Progress 
                percent={summary.totalClaims > 0 ? (summary.statusBreakdown.rejected / summary.totalClaims * 100).toFixed(1) : 0} 
                strokeColor="#ff4d4f"
                showInfo={false}
              />

              <div className="flex justify-between items-center">
                <Space>
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <Text>Submitted</Text>
                </Space>
                <Text strong>{summary.statusBreakdown.submitted}</Text>
              </div>
              <Progress 
                percent={summary.totalClaims > 0 ? (summary.statusBreakdown.submitted / summary.totalClaims * 100).toFixed(1) : 0} 
                strokeColor="#fa8c16"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Items Breakdown */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title={<Space><ExperimentOutlined /> Claims Items Breakdown</Space>}
            className="shadow-sm"
          >
            {itemsBreakdown.length > 0 ? (
              <Row gutter={[16, 16]}>
                {itemsBreakdown.map((item, index) => (
                  <Col xs={24} sm={12} md={6} key={index}>
                    <Card size="small" className="bg-gray-50">
                      <Statistic
                        title={item.item_type || 'Unknown'}
                        value={item.count || 0}
                        suffix={
                          <Text type="secondary" className="text-xs">
                            {formatCurrency(item.totalAmount || 0)}
                          </Text>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description="No items breakdown available" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );

  // Claims List Tab Content
  const renderClaimsListTab = () => (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="shadow-sm">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Search
              placeholder="Search by patient name, MRN, claim ID..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              loading={loading}
            />
          </Col>
          <Col xs={24} md={4}>
            <Select
              placeholder="Filter by status"
              className="w-full"
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <Option value="all">All Statuses</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Submitted">Submitted</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <RangePicker 
              className="w-full"
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} md={6}>
            <Space>
              <Button 
                icon={<SyncOutlined />} 
                onClick={handleRefresh}
                loading={loading}
              >
                Refresh
              </Button>
              <Button 
                icon={<FileExcelOutlined />} 
                onClick={handleExportExcel}
              >
                Export
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Batch Actions */}
      {selectedRowKeys.length > 0 && (
        <Alert
          message={
            <Space>
              <span>{selectedRowKeys.length} claim(s) selected</span>
              <Button 
                type="primary" 
                size="small" 
                icon={<FileDoneOutlined />}
                onClick={handleBatchSubmit}
                loading={submittingBatch}
              >
                Create Batch Submission
              </Button>
              <Button 
                size="small"
                onClick={() => setSelectedRowKeys([])}
              >
                Clear Selection
              </Button>
            </Space>
          }
          type="info"
          showIcon
        />
      )}

      {/* Claims Table */}
      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={claims}
          rowKey="id"
          rowSelection={rowSelection}
          loading={loading}
          pagination={{
            current: pagination.currentPage,
            total: pagination.totalItems,
            pageSize: pagination.itemsPerPage,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} claims`,
            onChange: (page, pageSize) => fetchClaims(page, pageSize),
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );

  // Export Tab Content
  const renderExportTab = () => (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card 
            title={<Space><FileExcelOutlined /> Export to Excel</Space>}
            className="shadow-sm"
          >
            <Space direction="vertical" className="w-full">
              <Text type="secondary">
                Export all claims data to Excel format for offline analysis and reporting.
              </Text>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={handleExportExcel}
                block
              >
                Download Excel
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title={<Space><FilePdfOutlined /> Generate NHIS Batch</Space>}
            className="shadow-sm"
          >
            <Space direction="vertical" className="w-full">
              <Text type="secondary">
                Generate NHIA-compliant batch file for official claim submission.
              </Text>
              <Button 
                type="primary" 
                icon={<FileDoneOutlined />} 
                disabled={selectedRowKeys.length === 0}
                onClick={handleBatchSubmit}
                block
              >
                Generate Batch ({selectedRowKeys.length})
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card 
        title={<Space><ExportOutlined /> Export History</Space>}
        className="shadow-sm"
      >
        <Empty description="No export history available" />
      </Card>
    </div>
  );

  // Claim Details Drawer
  const renderDetailsDrawer = () => (
    <Drawer
      title="Claim Details"
      placement="right"
      width={600}
      onClose={() => setIsDetailsDrawerVisible(false)}
      open={isDetailsDrawerVisible}
      extra={
        <Space>
          <Button onClick={() => setIsDetailsDrawerVisible(false)}>Close</Button>
          {selectedClaim?.claim_status === 'Pending' && (
            <>
              <Popconfirm
                title="Approve this claim?"
                onConfirm={() => handleUpdateStatus(selectedClaim.id, 'Approved')}
              >
                <Button type="primary" icon={<CheckCircleOutlined />} className="bg-green-500">
                  Approve
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Reject this claim?"
                onConfirm={() => handleUpdateStatus(selectedClaim.id, 'Rejected')}
              >
                <Button danger icon={<CloseCircleOutlined />}>
                  Reject
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      }
    >
      {selectedClaim && (
        <div className="space-y-6">
          {/* Claim Header */}
          <Card size="small" className="bg-blue-50">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text type="secondary">Claim Reference</Text>
                <div className="font-mono">{selectedClaim.claim_reference_number || selectedClaim.id}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Status</Text>
                <div>
                  <Tag color={statusColors[selectedClaim.claim_status]} className="mt-1">
                    {selectedClaim.claim_status?.toUpperCase()}
                  </Tag>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Patient Information */}
          <div>
            <Title level={5}>Patient Information</Title>
            <Card size="small">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">Name</Text>
                  <div>
                    {selectedClaim.visit?.patient ? 
                      `${selectedClaim.visit.patient.first_name || ''} ${selectedClaim.visit.patient.last_name || ''}`.trim() : 
                      'N/A'}
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">NHIS Number</Text>
                  <div>{selectedClaim.visit?.patient?.nhis_number || 'N/A'}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">MRN</Text>
                  <div>{selectedClaim.visit?.patient?.mrn || 'N/A'}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Gender</Text>
                  <div>{selectedClaim.visit?.patient?.gender || 'N/A'}</div>
                </Col>
              </Row>
            </Card>
          </div>

          {/* Visit Information */}
          <div>
            <Title level={5}>Visit Information</Title>
            <Card size="small">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">Visit Type</Text>
                  <div>
                    <Tag color={serviceTypeColors[selectedClaim.visit?.visit_type]}>
                      {selectedClaim.visit?.visit_type || 'N/A'}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Visit Date</Text>
                  <div>
                    {selectedClaim.visit?.visit_date ? 
                      dayjs(selectedClaim.visit.visit_date).format('DD/MM/YYYY') : 
                      'N/A'}
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Department</Text>
                  <div>{selectedClaim.visit?.department?.name || 'N/A'}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Attendance Number</Text>
                  <div>{selectedClaim.visit?.attendance_number || 'N/A'}</div>
                </Col>
              </Row>
            </Card>
          </div>

          {/* Claim Items */}
          <div>
            <Title level={5}>Claim Items</Title>
            {selectedClaim.items && selectedClaim.items.length > 0 ? (
              <Card size="small">
                {selectedClaim.items.map((item, index) => (
                  <div key={index} className={index > 0 ? 'mt-4 pt-4 border-t' : ''}>
                    <Row gutter={[16, 8]}>
                      <Col span={12}>
                        <Text type="secondary">Item Type</Text>
                        <div><Tag>{item.item_type || 'N/A'}</Tag></div>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary">Amount</Text>
                        <div className="font-medium">{formatCurrency(item.amount)}</div>
                      </Col>
                      {item.diagnosis && (
                        <>
                          <Col span={12}>
                            <Text type="secondary">Diagnosis</Text>
                            <div>{item.diagnosis.diagnosis_name || 'N/A'}</div>
                          </Col>
                          <Col span={12}>
                            <Text type="secondary">ICD-10 Code</Text>
                            <div>{item.diagnosis.icd10_code || 'N/A'}</div>
                          </Col>
                        </>
                      )}
                      {item.prescription && (
                        <Col span={24}>
                          <Text type="secondary">Prescription</Text>
                          <div>{item.prescription.medication_name || 'N/A'}</div>
                        </Col>
                      )}
                    </Row>
                  </div>
                ))}
              </Card>
            ) : (
              <Empty description="No items available" />
            )}
          </div>

          {/* Financial Summary */}
          <div>
            <Title level={5}>Financial Summary</Title>
            <Card size="small">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">Total Amount</Text>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(selectedClaim.total_amount)}
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Submission Date</Text>
                  <div>
                    {selectedClaim.submission_date ? 
                      dayjs(selectedClaim.submission_date).format('DD/MM/YYYY') : 
                      'Not submitted'}
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      )}
    </Drawer>
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <Card className="mb-4 shadow-sm">
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="middle">
              <BankOutlined className="text-2xl text-blue-600" />
              <div>
                <Title level={4} style={{ margin: 0 }}>NHIS Claims Management</Title>
                <Text type="secondary">
                  {admin?.institution?.name || 'Hospital Management System'} | 
                  Claims Dashboard
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                Refresh
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setActiveTab('claims')}>
                New Claim
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Tabs */}
      <Card className="shadow-sm">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              key: 'dashboard',
              label: <span><BarChartOutlined /> Dashboard</span>,
              children: renderDashboardTab(),
            },
            {
              key: 'claims',
              label: <span><UnorderedListOutlined /> Claims List</span>,
              children: renderClaimsListTab(),
            },
            {
              key: 'export',
              label: <span><ExportOutlined /> Export & Submit</span>,
              children: renderExportTab(),
            },
          ]}
        />
      </Card>

      {/* Details Drawer */}
      {renderDetailsDrawer()}
    </div>
  );
};

export default InsuranceClaims;
