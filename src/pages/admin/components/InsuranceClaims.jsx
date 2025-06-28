import React, { useState } from 'react';
import { Table, Tag, Card, Button, Input, Select, DatePicker, Modal, Progress, Avatar, Badge, message } from 'antd';
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
  DollarOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Current hospital data
const currentHospital = {
  name: 'Komfo Anokye Teaching Hospital',
  id: 'HOSP-001',
  location: 'Kumasi, Ashanti Region',
  nhisCode: 'NHIS-KATH-001'
};

// Dummy NHIS claims data for current hospital only
const dummyClaims = [
  {
    id: `NHIS-${currentHospital.nhisCode}-2023-001`,
    patient: {
      name: 'Kwame Asare',
      id: 'NHIS-12345678',
      avatar: null,
      age: 42,
      gender: 'male'
    },
    serviceDate: '2023-05-15',
    submissionDate: '2023-05-16',
    serviceType: 'Inpatient',
    diagnosis: 'Malaria (B54)',
    diagnosisCode: 'B54',
    treatment: 'Artemether/Lumefantrine',
    amount: 1200.00,
    status: 'approved',
    aiReview: {
      status: 'verified',
      confidence: 92,
      flags: []
    },
    paymentStatus: 'paid',
    paymentDate: '2023-05-25'
  },
  {
    id: `NHIS-${currentHospital.nhisCode}-2023-002`,
    patient: {
      name: 'Ama Mensah',
      id: 'NHIS-87654321',
      avatar: null,
      age: 28,
      gender: 'female'
    },
    serviceDate: '2023-05-18',
    submissionDate: '2023-05-19',
    serviceType: 'Outpatient',
    diagnosis: 'Hypertension (I10)',
    diagnosisCode: 'I10',
    treatment: 'Amlodipine 10mg',
    amount: 350.50,
    status: 'pending',
    aiReview: {
      status: 'pending',
      confidence: 78,
      flags: ['unusual_dosage']
    },
    paymentStatus: 'pending',
    paymentDate: null
  },
  {
    id: `NHIS-${currentHospital.nhisCode}-2023-003`,
    patient: {
      name: 'Yaw Boateng',
      id: 'NHIS-45678901',
      avatar: null,
      age: 65,
      gender: 'male'
    },
    serviceDate: '2023-05-20',
    submissionDate: '2023-05-21',
    serviceType: 'Surgery',
    diagnosis: 'Appendicitis (K35)',
    diagnosisCode: 'K35',
    treatment: 'Appendectomy',
    amount: 4500.00,
    status: 'rejected',
    aiReview: {
      status: 'flagged',
      confidence: 85,
      flags: ['duplicate_claim']
    },
    paymentStatus: 'rejected',
    paymentDate: null
  },
  {
    id: `NHIS-${currentHospital.nhisCode}-2023-004`,
    patient: {
      name: 'Esi Nyarko',
      id: 'NHIS-23456789',
      avatar: null,
      age: 34,
      gender: 'female'
    },
    serviceDate: '2023-05-22',
    submissionDate: '2023-05-23',
    serviceType: 'Maternity',
    diagnosis: 'Antenatal care (Z34)',
    diagnosisCode: 'Z34',
    treatment: 'Routine checkup',
    amount: 800.00,
    status: 'approved',
    aiReview: {
      status: 'verified',
      confidence: 95,
      flags: []
    },
    paymentStatus: 'processing',
    paymentDate: null
  },
];

const statusColors = {
  approved: 'green',
  pending: 'blue',
  rejected: 'red',
  under_review: 'orange'
};

const paymentStatusColors = {
  paid: 'green',
  pending: 'blue',
  rejected: 'red',
  processing: 'orange'
};

const aiStatusColors = {
  verified: 'green',
  pending: 'blue',
  flagged: 'red',
  in_progress: 'orange'
};

const serviceTypeColors = {
  Inpatient: 'purple',
  Outpatient: 'blue',
  Surgery: 'red',
  Maternity: 'pink',
  Laboratory: 'cyan'
};

const InsuranceClaims = () => {
  const [filteredData, setFilteredData] = useState(dummyClaims);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, statusFilter, dateRange);
  };

  const applyFilters = (search, status, dates) => {
    let result = [...dummyClaims];
    
    if (search) {
      result = result.filter(claim => 
        claim.patient.name.toLowerCase().includes(search.toLowerCase()) ||
        claim.id.toLowerCase().includes(search.toLowerCase()) ||
        claim.patient.id.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status !== 'all') {
      result = result.filter(claim => claim.status === status);
    }
    
    if (dates && dates.length === 2) {
      result = result.filter(claim => {
        const serviceDate = dayjs(claim.serviceDate);
        return serviceDate.isAfter(dates[0]) && serviceDate.isBefore(dates[1]);
      });
    }
    
    setFilteredData(result);
  };

  const handleViewDetails = (record) => {
    setSelectedClaim(record);
    setIsModalVisible(true);
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      message.warning('No data to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredData.map(claim => ({
      'Claim ID': claim.id,
      'Patient Name': claim.patient.name,
      'NHIS ID': claim.patient.id,
      'Service Date': claim.serviceDate,
      'Service Type': claim.serviceType,
      'Diagnosis': claim.diagnosis,
      'Diagnosis Code': claim.diagnosisCode,
      'Amount (GHS)': claim.amount,
      'Status': claim.status,
      'Payment Status': claim.paymentStatus
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'NHIS Claims');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `NHIS_Claims_${currentHospital.name}_${dayjs().format('YYYYMMDD')}.xlsx`);
    
    message.success('Excel file exported successfully');
  };

  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      message.warning('No data to export');
      return;
    }

    const csvContent = [
      ['Claim ID', 'Patient Name', 'NHIS ID', 'Service Date', 'Service Type', 'Diagnosis', 'Amount (GHS)', 'Status', 'Payment Status'],
      ...filteredData.map(claim => [
        claim.id,
        claim.patient.name,
        claim.patient.id,
        claim.serviceDate,
        claim.serviceType,
        claim.diagnosis,
        claim.amount.toFixed(2),
        claim.status,
        claim.paymentStatus
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `NHIS_Claims_${currentHospital.name}_${dayjs().format('YYYYMMDD')}.csv`);
    
    message.success('CSV file exported successfully');
  };

  const handleGenerateBatch = () => {
    if (selectedRows.length === 0) {
      message.warning('Please select claims to generate batch');
      return;
    }

    Modal.confirm({
      title: 'Generate NHIS Claims Batch',
      content: `This will create a batch submission file for ${selectedRows.length} selected claims. Continue?`,
      okText: 'Generate Batch',
      cancelText: 'Cancel',
      onOk: () => {
        message.success(`Batch file generated for ${selectedRows.length} claims`);
        // In a real app, this would generate the actual NHIS batch file format
      },
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };

  const columns = [
    {
      title: 'Claim ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <span className="font-mono">{id}</span>,
    },
    {
      title: 'Patient',
      dataIndex: 'patient',
      key: 'patient',
      render: (patient) => (
        <div className="flex items-center">
          <Avatar src={patient.avatar} icon={<UserOutlined />} className="mr-2" />
          <div>
            <div className="font-medium">{patient.name}</div>
            <div className="text-gray-500 text-xs">{patient.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Service Date',
      dataIndex: 'serviceDate',
      key: 'serviceDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.serviceDate) - new Date(b.serviceDate),
    },
    {
      title: 'Service',
      dataIndex: 'serviceType',
      key: 'serviceType',
      render: (type) => <Tag color={serviceTypeColors[type]}>{type}</Tag>,
      filters: [
        { text: 'Inpatient', value: 'Inpatient' },
        { text: 'Outpatient', value: 'Outpatient' },
        { text: 'Surgery', value: 'Surgery' },
        { text: 'Maternity', value: 'Maternity' },
      ],
      onFilter: (value, record) => record.serviceType === value,
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      render: (diagnosis, record) => (
        <div>
          <div>{diagnosis}</div>
          <div className="text-gray-500 text-xs">{record.diagnosisCode}</div>
        </div>
      ),
    },
    {
      title: 'Amount (GHS)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <span className="font-medium">{amount.toFixed(2)}</span>,
      align: 'right',
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<FileTextOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">NHIS Claims Management</h2>
          <p className="text-gray-600">{currentHospital.name} ({currentHospital.nhisCode})</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          New Claim
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <Search
            placeholder="Search claims..."
            allowClear
            enterButton={<SearchOutlined />}
            className="w-full md:w-64"
            onSearch={handleSearch}
          />
          <Select
            placeholder="Filter by status"
            className="w-full md:w-48"
            onChange={(value) => {
              setStatusFilter(value);
              applyFilters(searchTerm, value, dateRange);
            }}
          >
            <Option value="all">All Statuses</Option>
            <Option value="approved">Approved</Option>
            <Option value="pending">Pending</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <RangePicker
            format="DD/MM/YYYY"
            className="w-full md:w-64"
            onChange={(dates) => {
              setDateRange(dates);
              applyFilters(searchTerm, statusFilter, dates);
            }}
          />
          <div className="flex gap-2">
            <Button 
              type="primary" 
              icon={<RobotOutlined />}
              onClick={() => handleGenerateBatch()}
              disabled={selectedRows.length === 0}
            >
              Generate Batch ({selectedRows.length})
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Claims</p>
              <h3 className="text-2xl font-bold">{filteredData.length}</h3>
            </div>
            <FileTextOutlined className="text-blue-500 text-2xl" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending Approval</p>
              <h3 className="text-2xl font-bold">
                {filteredData.filter(c => c.status === 'pending').length}
              </h3>
            </div>
            <ClockCircleOutlined className="text-orange-500 text-2xl" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Approved Claims</p>
              <h3 className="text-2xl font-bold">
                {filteredData.filter(c => c.status === 'approved').length}
              </h3>
            </div>
            <CheckCircleOutlined className="text-green-500 text-2xl" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Value (GHS)</p>
              <h3 className="text-2xl font-bold">
                {filteredData.reduce((sum, claim) => sum + claim.amount, 0).toFixed(2)}
              </h3>
            </div>
            <DollarOutlined className="text-purple-500 text-2xl" />
          </div>
        </Card>
      </div>

      {/* Claims Table */}
      <Card className="shadow-sm">
        <div className="flex justify-end gap-2 mb-4">
          <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
            Export Excel
          </Button>
          <Button icon={<FileTextOutlined />} onClick={handleExportCSV}>
            Export CSV
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} NHIS claims`
          }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Claim Details Modal */}
      <Modal
        title="NHIS Claim Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
          <Button key="print" type="primary">
            Print Claim Form
          </Button>
        ]}
        width={800}
      >
        {selectedClaim && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Hospital Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {currentHospital.name}</p>
                  <p><span className="font-medium">NHIS Code:</span> {currentHospital.nhisCode}</p>
                  <p><span className="font-medium">Location:</span> {currentHospital.location}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Claim Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Claim ID:</span> {selectedClaim.id}</p>
                  <p><span className="font-medium">Service Date:</span> {dayjs(selectedClaim.serviceDate).format('DD/MM/YYYY')}</p>
                  <p><span className="font-medium">Submission Date:</span> {dayjs(selectedClaim.submissionDate).format('DD/MM/YYYY')}</p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <Tag color={statusColors[selectedClaim.status]} className="ml-2">
                      {selectedClaim.status.toUpperCase()}
                    </Tag>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Patient Information</h3>
                <div className="flex items-start space-x-4">
                  <Avatar size={64} src={selectedClaim.patient.avatar} icon={<UserOutlined />} />
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedClaim.patient.name}</p>
                    <p><span className="font-medium">NHIS ID:</span> {selectedClaim.patient.id}</p>
                    <p><span className="font-medium">Age/Gender:</span> {selectedClaim.patient.age} years, {selectedClaim.patient.gender}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Service Details</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Service Type:</span>{' '}
                    <Tag color={serviceTypeColors[selectedClaim.serviceType]}>{selectedClaim.serviceType}</Tag>
                  </p>
                  <p><span className="font-medium">Diagnosis:</span> {selectedClaim.diagnosis} ({selectedClaim.diagnosisCode})</p>
                  <p><span className="font-medium">Treatment:</span> {selectedClaim.treatment}</p>
                  <p><span className="font-medium">Amount:</span> GHS {selectedClaim.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Payment Information</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <Tag color={paymentStatusColors[selectedClaim.paymentStatus]} className="ml-2">
                      {selectedClaim.paymentStatus.toUpperCase()}
                    </Tag>
                  </p>
                  {selectedClaim.paymentDate && (
                    <p><span className="font-medium">Payment Date:</span> {dayjs(selectedClaim.paymentDate).format('DD/MM/YYYY')}</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">AI Review</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <Tag color={aiStatusColors[selectedClaim.aiReview.status]} className="ml-2">
                      {selectedClaim.aiReview.status.toUpperCase()}
                    </Tag>
                  </p>
                  <p><span className="font-medium">Confidence:</span> {selectedClaim.aiReview.confidence}%</p>
                  {selectedClaim.aiReview.flags.length > 0 && (
                    <p><span className="font-medium">Flags:</span> {selectedClaim.aiReview.flags.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InsuranceClaims;