import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmissions } from '../../../redux/slice/admissionSlice';
import { Table, Tag, Space, Avatar, Card, Statistic, Button, Input, Select, DatePicker, Modal,Spin } from 'antd';
import { 
  UserOutlined, 
  SearchOutlined, 
  FilterOutlined,
  FileTextOutlined,
  DownloadOutlined,
  PlusOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Dummy data for demonstration
const dummyAdmissions = [
  {
    id: 1,
    patient: {
      first_name: 'John',
      last_name: 'Doe',
      profile_pic: null,
    },
    patient_id: 1001,
    department: { name: 'Cardiology' },
    bed: { bed_number: 'C-102' },
    admission_date: '2023-05-15T10:30:00',
    status: 'active',
    diagnosis: 'Hypertension',
    doctor: 'Dr. Smith'
  },
  {
    id: 2,
    patient: {
      first_name: 'Jane',
      last_name: 'Smith',
      profile_pic: null,
    },
    patient_id: 1002,
    department: { name: 'Pediatrics' },
    bed: { bed_number: 'P-205' },
    admission_date: '2023-06-20T14:45:00',
    status: 'active',
    diagnosis: 'Pneumonia',
    doctor: 'Dr. Johnson'
  },
  {
    id: 3,
    patient: {
      first_name: 'Robert',
      last_name: 'Brown',
      profile_pic: null,
    },
    patient_id: 1003,
    department: { name: 'Orthopedics' },
    bed: { bed_number: 'O-301' },
    admission_date: '2023-04-10T09:15:00',
    status: 'discharged',
    diagnosis: 'Fractured Arm',
    doctor: 'Dr. Williams'
  },
];

const InstitutionAdmissions = () => {
  const dispatch = useDispatch();
  const { loading, admissions } = useSelector((state) => state.admission);
  const { user, admin } = useSelector((state) => state.auth);
  const currentUser = user || admin;
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [filteredData, setFilteredData] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [dateRange, setDateRange] = React.useState([]);

  useEffect(() => {
    dispatch(fetchAdmissions({})); // Fetch all admissions for institution
    // For demo purposes, we'll use dummy data
    setFilteredData(dummyAdmissions);
  }, [dispatch]);

  useEffect(() => {
    // Filter logic
    let result = [...dummyAdmissions]; // Replace with admissions when using real data
    
    if (searchTerm) {
      result = result.filter(admission => 
        `${admission.patient.first_name} ${admission.patient.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        admission.patient_id.toString().includes(searchTerm)
  )}
    
    if (statusFilter !== 'all') {
      result = result.filter(admission => admission.status === statusFilter);
    }
    
    if (dateRange.length === 2) {
      result = result.filter(admission => {
        const admissionDate = dayjs(admission.admission_date);
        return admissionDate.isAfter(dateRange[0]) && 
               admissionDate.isBefore(dateRange[1]);
      });
    }
    
    setFilteredData(result);
  }, [searchTerm, statusFilter, dateRange]);

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleDischarge = (record) => {
    Modal.confirm({
      title: `Discharge ${record.patient.first_name} ${record.patient.last_name}?`,
      content: 'This action will mark the patient as discharged.',
      okText: 'Confirm Discharge',
      cancelText: 'Cancel',
      onOk: () => {
        // Dispatch discharge action here
        message.success('Patient discharged successfully');
      },
    });
  };

  const handleNewAdmission = () => {
    // Implement new admission logic
    console.log('New admission');
  };

  const columns = [
    {
      title: 'Patient',
      dataIndex: 'patient',
      key: 'patient',
      render: (_, record) => (
        <Space>
          <Avatar 
            src={record.patient?.profile_pic} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div className="font-medium">{record.patient.first_name} {record.patient.last_name}</div>
            <div className="text-gray-500 text-xs">ID: #{record.patient_id}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => (
        <Tag color="blue" className="font-medium">
          {department?.name || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Bed',
      dataIndex: 'bed',
      key: 'bed',
      render: (bed) => (
        <Tag color="geekblue">
          {bed?.bed_number || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Admission Date',
      dataIndex: 'admission_date',
      key: 'admission_date',
      render: (date) => (
        <div className="text-gray-700">
          {dayjs(date).format('MMM D, YYYY h:mm A')}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'} className="font-medium">
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<FileTextOutlined />} 
            onClick={() => handleViewDetails(record)}
          >
            Details
          </Button>
          {record.status === 'active' && (
            <Button 
              type="link" 
              danger 
              onClick={() => handleDischarge(record)}
            >
              Discharge
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Patient Admissions</h2>
        <div className="text-gray-600">
          <span className="font-medium">{currentUser.institution?.name}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <Statistic 
            title="Total Admissions" 
            value={filteredData.length} 
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
        <Card>
          <Statistic 
            title="Active" 
            value={filteredData.filter(a => a.status === 'active').length} 
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
        <Card>
          <Statistic 
            title="Discharged" 
            value={filteredData.filter(a => a.status === 'discharged').length} 
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
        <Card>
          <Statistic 
            title="Avg Stay (days)" 
            value={7.2} 
            precision={1}
            valueStyle={{ color: '#d48806' }}
          />
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Search
              placeholder="Search patients..."
              prefix={<SearchOutlined />}
              allowClear
              enterButton
              className="w-full md:w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select
              placeholder="Filter by status"
              className="w-full md:w-48"
              suffixIcon={<FilterOutlined />}
              onChange={(value) => setStatusFilter(value)}
            >
              <Option value="all">All Statuses</Option>
              <Option value="active">Active</Option>
              <Option value="discharged">Discharged</Option>
            </Select>
            
            <RangePicker
              showTime
              className="w-full md:w-64"
              onChange={(dates) => setDateRange(dates)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button icon={<DownloadOutlined />}>Export</Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleNewAdmission}
            >
              New Admission
            </Button>
          </div>
        </div>
      </Card>

      {/* Admissions Table */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Loading admissions data...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} admissions`
            }}
            bordered
            scroll={{ x: true }}
          />
        )}
      </Card>

      {/* Patient Details Modal */}
      <Modal
        title="Patient Admission Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedRecord && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Patient Information</h3>
              <div className="space-y-3">
                <p><span className="font-medium">Name:</span> {selectedRecord.patient.first_name} {selectedRecord.patient.last_name}</p>
                <p><span className="font-medium">Patient ID:</span> #{selectedRecord.patient_id}</p>
                <p><span className="font-medium">Admission Date:</span> {dayjs(selectedRecord.admission_date).format('MMMM D, YYYY h:mm A')}</p>
                <p><span className="font-medium">Status:</span> <Tag color={selectedRecord.status === 'active' ? 'green' : 'red'}>{selectedRecord.status.toUpperCase()}</Tag></p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Medical Information</h3>
              <div className="space-y-3">
                <p><span className="font-medium">Department:</span> <Tag color="blue">{selectedRecord.department?.name}</Tag></p>
                <p><span className="font-medium">Bed:</span> <Tag color="geekblue">{selectedRecord.bed?.bed_number}</Tag></p>
                <p><span className="font-medium">Primary Diagnosis:</span> {selectedRecord.diagnosis || 'Not specified'}</p>
                <p><span className="font-medium">Attending Doctor:</span> {selectedRecord.doctor || 'Not assigned'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InstitutionAdmissions; 