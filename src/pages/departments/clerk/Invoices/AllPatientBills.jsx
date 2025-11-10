import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Tag,
    Badge,
    Button,
    Space,
    Statistic,
    Row,
    Col,
    Input,
    Select,
    DatePicker,
    Tooltip,
    Progress,
    Divider,
    Alert
} from 'antd';
import {
    EyeOutlined,
    DownloadOutlined,
    SearchOutlined,
    FilterOutlined,
    DollarOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoices } from '../../../../redux/slice/invoiceSlice';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AllPatientBills = () => {
    const dispatch = useDispatch();
    const { invoices, loading, error, pagination } = useSelector((state) => state.invoices);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchInvoices({ page: 1, limit: 50 }));
    }, [dispatch]);

    // Filter invoices based on search, status, and date range
    useEffect(() => {
        let filtered = invoices || [];

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(invoice => invoice.status === statusFilter);
        }

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(invoice =>
                invoice.visit?.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Date range filter
        if (dateRange && dateRange.length === 2) {
            filtered = filtered.filter(invoice => {
                const invoiceDate = moment(invoice.invoice_date).format('YYYY-MM-DD');
                return invoiceDate.isAfter(dateRange[0]) && invoiceDate.isBefore(dateRange[1]);
            });
        }

        setFilteredInvoices(filtered);
    }, [invoices, statusFilter, searchTerm, dateRange]);

    // Calculate statistics
    const stats = React.useMemo(() => {
        if (!invoices) return {};

        const totalInvoices = invoices.length;
        const totalAmount = invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
        const paidAmount = invoices.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0);
        const pendingAmount = invoices.reduce((sum, inv) => sum + (inv.balance_due || 0), 0);

        const statusCounts = {
            draft: invoices.filter(inv => inv.status === 'draft').length,
            paid: invoices.filter(inv => inv.status === 'paid').length,
            pending: invoices.filter(inv => inv.status === 'pending').length,
            overdue: invoices.filter(inv => inv.status === 'overdue').length,
        };

        return {
            totalInvoices,
            totalAmount,
            paidAmount,
            pendingAmount,
            statusCounts,
            collectionRate: totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0
        };
    }, [invoices]);

    // Status tag component
    const StatusTag = ({ status }) => {
        const statusConfig = {
            draft: { color: 'default', text: 'Draft', icon: <FileTextOutlined /> },
            paid: { color: 'success', text: 'Paid', icon: <CheckCircleOutlined /> },
            pending: { color: 'processing', text: 'Pending', icon: <ClockCircleOutlined /> },
            overdue: { color: 'error', text: 'Overdue', icon: <CloseCircleOutlined /> },
        };

        const config = statusConfig[status] || { color: 'default', text: status, icon: <FileTextOutlined /> };

        return (
            <Tag color={config.color} icon={config.icon} className="flex items-center">
                {config.text}
            </Tag>
        );
    };

    // Amount display with color coding
    const AmountDisplay = ({ amount, type = 'total' }) => {
        const color = type === 'paid' ? '#52c41a' : type === 'pending' ? '#faad14' : '#1890ff';
        return (
            <span style={{ color, fontWeight: 'bold' }}>
                ${amount?.toFixed(2) || '0.00'}
            </span>
        );
    };

    // Table columns
    const columns = [
        {
            title: 'Invoice Details',
            key: 'invoice',
            render: (record) => (
                <Space direction="vertical" size={0}>
                    <div className="font-semibold text-blue-600">{record.invoice_number}</div>
                    <div className="text-xs text-gray-500">
                        {moment(record.invoice_date).format('MMM DD, YYYY')}
                    </div>
                    {record.visit?.patient && (
                        <div className="text-sm">
                            {record.visit.patient.name}
                            <Tag color="blue" className="ml-2 text-xs">
                                {record.visit.attendance_number}
                            </Tag>
                        </div>
                    )}
                </Space>
            ),
        },
        {
            title: 'Patient Info',
            key: 'patient',
            render: (record) => (
                <Space direction="vertical" size={0}>
                    {record.visit?.patient ? (
                        <>
                            <div className="font-medium">{record.visit.patient.first_name} {record.visit.patient.middle_name} {record.visit.patient.last_name}</div>
                            <div className="text-xs text-gray-500">
                                ID: {record.visit.patient.folderNumber || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">
                                {record.visit.patient.age || 'N/A'} • {record.visit.patient.gender || 'N/A'}
                            </div>
                        </>
                    ) : (
                        <span className="text-gray-400">No patient data</span>
                    )}
                </Space>
            ),
        },
        {
            title: 'Financial Summary',
            key: 'financial',
            render: (record) => (
                <Space direction="vertical" size={2}>
                    <div className="flex justify-between space-x-4">
                        <span>Total:</span>
                        <AmountDisplay amount={record.total_amount} />
                    </div>
                    <div className="flex justify-between space-x-4">
                        <span>Paid:</span>
                        <AmountDisplay amount={record.amount_paid} type="paid" />
                    </div>
                    <div className="flex justify-between space-x-4">
                        <span>Balance:</span>
                        <AmountDisplay amount={record.balance_due} type="pending" />
                    </div>
                    {record.balance_due > 0 && (
                        <Progress
                            percent={Math.round(((record.amount_paid || 0) / record.total_amount) * 100)}
                            size="small"
                            showInfo={false}
                        />
                    )}
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <StatusTag status={status} />,
            filters: [
                { text: 'Draft', value: 'draft' },
                { text: 'Pending', value: 'pending' },
                { text: 'Paid', value: 'paid' },
                { text: 'Overdue', value: 'overdue' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Due Date',
            dataIndex: 'due_date',
            key: 'due_date',
            render: (dueDate) => (
                <Space direction="vertical" size={0}>
                    <div className={moment(dueDate).isBefore(moment()) ? 'text-red-500 font-medium' : ''}>
                        {moment(dueDate).format('MMM DD, YYYY')}
                    </div>
                    <div className="text-xs text-gray-500">
                        {moment(dueDate).format('dddd')}
                    </div>
                </Space>
            ),
            sorter: (a, b) => moment(a.due_date).unix() - moment(b.due_date).unix(),

        },
        {
            title: 'Services',
            key: 'services',
            render: (record) => (
                <Tooltip
                    title={record.service_bills?.map(sb => sb.service_name).join(', ') || 'No services'}
                    placement="left"
                >
                    <Badge
                        count={record.service_bills?.length || 0}
                        showZero
                        style={{ backgroundColor: '#1890ff' }}
                    />
                </Tooltip>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetails(record)}
                            className="text-blue-500"
                        >
                            View
                        </Button>
                    </Tooltip>
                    {/* <Tooltip title="Download Invoice">
                        <Button
                            type="link"
                            icon={<DownloadOutlined />}
                            className="text-green-500"
                        >
                            PDF
                        </Button>
                    </Tooltip> */}
                </Space>
            ),
        },
    ];

    const handleViewDetails = (invoice) => {
        console.log(invoice)
        navigate(`/shared/clerk/invoices/${invoice.visit_id}`);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const handleRefresh = () => {
        dispatch(fetchInvoices({ page: 1, limit: 50 }));
    };

    if (error) {
        return (
            <Alert
                message="Error Loading Bills"
                description={error}
                type="error"
                showIcon
                className="m-4"
            />
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <DollarOutlined className="mr-3 text-green-500" />
                    Patient Billing Management
                </h1>
                <p className="text-gray-600">Manage and track all patient invoices and payments</p>
            </div>

            {/* Statistics Cards */}
            <Row gutter={16} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Total Invoices"
                            value={stats.totalInvoices}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Total Revenue"
                            value={stats.totalAmount}
                            prefix="$"
                            precision={2}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Collected"
                            value={stats.paidAmount}
                            prefix="$"
                            precision={2}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Pending Collection"
                            value={stats.pendingAmount}
                            prefix="$"
                            precision={2}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Status Overview */}
            <Card className="mb-6 shadow-sm" title="Invoice Status Overview">
                <Row gutter={16}>
                    <Col xs={24} sm={8}>
                        <div className="text-center p-4 border rounded-lg">
                            <StatusTag status="draft" />
                            <div className="text-2xl font-bold mt-2">{stats.statusCounts.draft || 0}</div>
                            <div className="text-gray-500">Draft Invoices</div>
                        </div>
                    </Col>
                    <Col xs={24} sm={8}>
                        <div className="text-center p-4 border rounded-lg">
                            <StatusTag status="pending" />
                            <div className="text-2xl font-bold mt-2">{stats.statusCounts.pending || 0}</div>
                            <div className="text-gray-500">Pending Payment</div>
                        </div>
                    </Col>
                    <Col xs={24} sm={8}>
                        <div className="text-center p-4 border rounded-lg">
                            <StatusTag status="paid" />
                            <div className="text-2xl font-bold mt-2">{stats.statusCounts.paid || 0}</div>
                            <div className="text-gray-500">Fully Paid</div>
                        </div>
                    </Col>
                </Row>
                <Divider />
                <div className="text-center">
                    <Progress
                        percent={Math.round(stats.collectionRate)}
                        status={stats.collectionRate === 100 ? 'success' : 'active'}
                        format={percent => `Collection Rate: ${percent}%`}
                    />
                </div>
            </Card>

            {/* Filters and Search */}
            <Card className="mb-6 shadow-sm" title="Filters & Search">
                <Row gutter={16} align="middle">
                    <Col xs={24} sm={8}>
                        <Search
                            placeholder="Search by patient or invoice..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            onSearch={handleSearch}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={6}>
                        <Select
                            placeholder="Filter by status"
                            style={{ width: '100%' }}
                            onChange={handleStatusFilter}
                            allowClear
                        >
                            <Option value="all">All Statuses</Option>
                            <Option value="draft">Draft</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="paid">Paid</Option>
                            <Option value="overdue">Overdue</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={8}>
                        <RangePicker
                            style={{ width: '100%' }}
                            onChange={handleDateRangeChange}
                            placeholder={['Start Date', 'End Date']}
                        />
                    </Col>
                    <Col xs={24} sm={2}>
                        <Button
                            icon={<SyncOutlined />}
                            onClick={handleRefresh}
                            loading={loading}
                        >
                            Refresh
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Invoices Table */}
            <Card
                title={
                    <Space>
                        <FileTextOutlined />
                        Patient Invoices
                        <Badge
                            count={filteredInvoices.length}
                            showZero
                            style={{ backgroundColor: '#1890ff' }}
                        />
                    </Space>
                }
                className="shadow-lg"
                extra={
                    <Space>
                        <Button icon={<FilterOutlined />}>Export</Button>
                        <Button type="primary" icon={<DownloadOutlined />}>
                            Bulk Download
                        </Button>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={filteredInvoices}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} invoices`
                    }}
                    scroll={{ x: 1000 }}
                    size="middle"
                />
            </Card>
        </div>
    );
};

export default AllPatientBills;