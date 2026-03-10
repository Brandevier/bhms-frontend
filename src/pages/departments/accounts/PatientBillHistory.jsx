import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchPatientsWithBilling,
  fetchPatientBillingHistory,
  makePatientPayment,
  setFilters,
  clearSelectedPatient
} from '../../../redux/slice/patientBillingSlice';
import {
  Card,
  Table,
  Input,
  Button,
  Tag,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  Select,
  InputNumber,
  message,
  Spin,
  Alert,
  Divider,
  Descriptions,
  Tabs,
  List,
  Badge,
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  DollarOutlined,
  FileTextOutlined,
  UserOutlined,
  PhoneOutlined,
  CreditCardOutlined,
  PrinterOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FilterOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const PatientBillHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const {
    patients,
    selectedPatient,
    patientHistory,
    loading,
    historyLoading,
    paymentLoading,
    error,
    pagination,
    filters
  } = useSelector((state) => state.patientBilling);

  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadPatients();
  }, [filters, pagination.page]);

  const loadPatients = () => {
    dispatch(fetchPatientsWithBilling({
      institution_id: user?.institution?.id,
      search: filters.search,
      status: filters.status,
      page: pagination.page,
      limit: 20
    }));
  };

  const handleSearch = (value) => {
    dispatch(setFilters({ search: value }));
  };

  const handleStatusFilter = (value) => {
    dispatch(setFilters({ status: value }));
  };

  const handleViewDetails = async (patient) => {
    dispatch(clearSelectedPatient());
    setDetailsModalVisible(true);
    dispatch(fetchPatientBillingHistory({
      patientId: patient.id,
      institutionId: user?.institution?.id
    }));
  };

  const handlePayment = (bill) => {
    setSelectedBill(bill);
    setPaymentModalVisible(true);
    form.setFieldsValue({ amount: bill.balance });
  };

  const handlePaymentSubmit = async (values) => {
    if (!selectedPatient || !selectedBill) return;

    try {
      await dispatch(makePatientPayment({
        patientId: selectedPatient.id,
        paymentData: {
          visit_id: selectedBill.visit_id,
          bill_id: selectedBill.id,
          amount: values.amount,
          payment_method: values.payment_method,
          notes: values.notes
        }
      })).unwrap();

      message.success('Payment recorded successfully');
      setPaymentModalVisible(false);
      form.resetFields();
      
      // Refresh patient history
      dispatch(fetchPatientBillingHistory({
        patientId: selectedPatient.id,
        institutionId: user?.institution?.id
      }));
      
      // Refresh patients list
      loadPatients();
    } catch (error) {
      message.error(error || 'Payment failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'partial': return 'warning';
      case 'unpaid': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircleOutlined />;
      case 'partial': return <ClockCircleOutlined />;
      case 'unpaid': return <ExclamationCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount || 0);
  };

  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.first_name} {record.last_name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.patient_id}</Text>
        </Space>
      )
    },
    {
      title: 'Contact',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <Space>
          <PhoneOutlined />
          {phone || 'N/A'}
        </Space>
      )
    },
    {
      title: 'Insurance',
      dataIndex: 'insurance_status',
      key: 'insurance_status',
      render: (status, record) => (
        <Tag color={status === 'Insured' ? 'blue' : 'orange'}>
          {status || 'Self-Pay'}
        </Tag>
      )
    },
    {
      title: 'Total Billed',
      dataIndex: 'total_billed',
      key: 'total_billed',
      render: (amount) => (
        <Text strong>{formatCurrency(amount)}</Text>
      )
    },
    {
      title: 'Total Paid',
      dataIndex: 'total_paid',
      key: 'total_paid',
      render: (amount) => (
        <Text type="success">{formatCurrency(amount)}</Text>
      )
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (amount) => (
        <Text type={amount > 0 ? 'danger' : 'success'} strong>
          {formatCurrency(amount)}
        </Text>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status?.toUpperCase() || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
          size="small"
        >
          View Invoice
        </Button>
      )
    }
  ];

  const expandedRowRender = (record) => (
    <Card size="small" title="Quick Summary">
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title="Bill Count"
            value={record.bill_count}
            prefix={<FileTextOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Total Billed"
            value={record.total_billed}
            prefix={<DollarOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Amount Paid"
            value={record.total_paid}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Outstanding"
            value={record.balance}
            valueStyle={{ color: record.balance > 0 ? '#cf1322' : '#3f8600' }}
          />
        </Col>
      </Row>
    </Card>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Patients"
              value={pagination.total}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Unpaid"
              value={patients.filter(p => p.status === 'unpaid').length}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Partially Paid"
              value={patients.filter(p => p.status === 'partial').length}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Fully Paid"
              value={patients.filter(p => p.status === 'paid').length}
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search by name, patient ID, or phone"
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={(e) => handleSearch(e.target.value)}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by status"
              style={{ width: '100%' }}
              allowClear
              onChange={handleStatusFilter}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">All</Option>
              <Option value="unpaid">Unpaid</Option>
              <Option value="partial">Partial</Option>
              <Option value="paid">Paid</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={10}>
            <Button type="primary" icon={<SearchOutlined />} onClick={loadPatients}>
              Search
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Patients Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={patients}
          rowKey="id"
          loading={loading}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.bill_count > 0
          }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            onChange: (page) => dispatch(setFilters({ page })),
            showSizeChanger: false
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Patient Details Modal */}
      <Modal
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => setDetailsModalVisible(false)} />
            Patient Billing Details
          </Space>
        }
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        width={1000}
        footer={null}
      >
        {historyLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : patientHistory ? (
          <>
            {/* Patient Info */}
            <Card size="small" className="mb-4">
              <Descriptions column={{ xs: 1, sm: 2, md: 4 }} bordered size="small">
                <Descriptions.Item label="Name">
                  {patientHistory.patient?.first_name} {patientHistory.patient?.last_name}
                </Descriptions.Item>
                <Descriptions.Item label="Patient ID">
                  {patientHistory.patient?.patient_id}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {patientHistory.patient?.phone || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Insurance">
                  <Tag color={patientHistory.patient?.insurance_status === 'Insured' ? 'blue' : 'orange'}>
                    {patientHistory.patient?.insurance_status || 'Self-Pay'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Summary Stats */}
            <Row gutter={16} className="mb-4">
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Total Billed"
                    value={patientHistory.summary?.total_billed || 0}
                    prefix={<DollarOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Total Paid"
                    value={patientHistory.summary?.total_paid || 0}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Outstanding"
                    value={patientHistory.summary?.total_outstanding || 0}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<ExclamationCircleOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            {/* Visits and Bills */}
            <Tabs
              items={patientHistory.visits?.map((visit, index) => ({
                key: index,
                label: (
                  <Space>
                    <FileTextOutlined />
                    Visit #{visit.visit_number} - {visit.visit_type}
                    <Tag color={visit.visit_status === 'Active' ? 'green' : 'default'}>
                      {visit.visit_status}
                    </Tag>
                  </Space>
                ),
                children: (
                  <Card size="small">
                    <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small" className="mb-4">
                      <Descriptions.Item label="Visit Date">
                        {new Date(visit.visit_date).toLocaleDateString()}
                      </Descriptions.Item>
                      <Descriptions.Item label="Visit Type">{visit.visit_type}</Descriptions.Item>
                      <Descriptions.Item label="Total Billed">
                        {formatCurrency(visit.visit_total_billed)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Total Paid">
                        {formatCurrency(visit.visit_total_paid)}
                      </Descriptions.Item>
                    </Descriptions>

                    <Divider orientation="left">Bills & Services</Divider>
                    <List
                      size="small"
                      dataSource={visit.bills}
                      renderItem={(bill) => (
                        <List.Item
                          actions={[
                            bill.balance > 0 && (
                              <Button
                                type="primary"
                                size="small"
                                icon={<CreditCardOutlined />}
                                onClick={() => handlePayment(bill)}
                              >
                                Pay {formatCurrency(bill.balance)}
                              </Button>
                            )
                          ].filter(Boolean)}
                        >
                          <List.Item.Meta
                            title={
                              <Space>
                                <Text>{bill.service_name || bill.service_type}</Text>
                                <Tag color={getStatusColor(bill.payment_status?.toLowerCase())}>
                                  {bill.payment_status}
                                </Tag>
                              </Space>
                            }
                            description={
                              <Space split={<Divider type="vertical" />}>
                                <span>Billed: {formatCurrency(bill.total_amount)}</span>
                                <span>Paid: {formatCurrency(bill.paid_amount)}</span>
                                <Text type="danger">Balance: {formatCurrency(bill.balance)}</Text>
                              </Space>
                            }
                          />
                        </List.Item>
                      )}
                    />

                    {visit.invoices?.length > 0 && (
                      <>
                        <Divider orientation="left">Invoices</Divider>
                        <List
                          size="small"
                          dataSource={visit.invoices}
                          renderItem={(invoice) => (
                            <List.Item>
                              <List.Item.Meta
                                title={
                                  <Space>
                                    <Text>Invoice #{invoice.invoice_number}</Text>
                                    <Tag color={getStatusColor(invoice.status)}>{invoice.status}</Tag>
                                  </Space>
                                }
                                description={
                                  <Space split={<Divider type="vertical" />}>
                                    <span>Total: {formatCurrency(invoice.total_amount)}</span>
                                    <span>Paid: {formatCurrency(invoice.amount_paid)}</span>
                                    <Text type="danger">Due: {formatCurrency(invoice.balance_due)}</Text>
                                  </Space>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      </>
                    )}
                  </Card>
                )
              }))}
            />
          </>
        ) : (
          <Alert message="No billing history found" type="info" />
        )}
      </Modal>

      {/* Payment Modal */}
      <Modal
        title="Record Payment"
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handlePaymentSubmit} layout="vertical">
          <Form.Item
            name="amount"
            label="Payment Amount"
            rules={[{ required: true, message: 'Please enter payment amount' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item
            name="payment_method"
            label="Payment Method"
            rules={[{ required: true, message: 'Please select payment method' }]}
          >
            <Select placeholder="Select payment method">
              <Option value="cash">Cash</Option>
              <Option value="card">Card</Option>
              <Option value="mobile_money">Mobile Money</Option>
              <Option value="bank_transfer">Bank Transfer</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} placeholder="Optional notes" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setPaymentModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={paymentLoading}>
                Record Payment
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PatientBillHistory;

