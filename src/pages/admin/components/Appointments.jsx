import React, { useState } from 'react';
import { Table, Tag, Space, Card, Button, Input, Select, DatePicker, Modal, Badge, Avatar } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  CalendarOutlined,
  UserOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Dummy data
const dummyAppointments = [
  {
    id: 1,
    patient: {
      name: 'John Doe',
      id: 'PID-1001',
      avatar: null,
      age: 45,
      gender: 'male'
    },
    doctor: {
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology'
    },
    date: '2023-06-15T09:30:00',
    duration: 30,
    status: 'confirmed',
    type: 'Follow-up',
    notes: 'Hypertension checkup'
  },
  {
    id: 2,
    patient: {
      name: 'Jane Smith',
      id: 'PID-1002',
      avatar: null,
      age: 32,
      gender: 'female'
    },
    doctor: {
      name: 'Dr. Michael Chen',
      specialty: 'Pediatrics'
    },
    date: '2023-06-15T10:15:00',
    duration: 45,
    status: 'completed',
    type: 'Consultation',
    notes: 'Annual pediatric check'
  },
  {
    id: 3,
    patient: {
      name: 'Robert Wilson',
      id: 'PID-1003',
      avatar: null,
      age: 58,
      gender: 'male'
    },
    doctor: {
      name: 'Dr. Emily Park',
      specialty: 'Orthopedics'
    },
    date: '2023-06-16T14:00:00',
    duration: 60,
    status: 'scheduled',
    type: 'Procedure',
    notes: 'Knee evaluation'
  },
  {
    id: 4,
    patient: {
      name: 'Maria Garcia',
      id: 'PID-1004',
      avatar: null,
      age: 28,
      gender: 'female'
    },
    doctor: {
      name: 'Dr. David Kim',
      specialty: 'Dermatology'
    },
    date: '2023-06-16T11:30:00',
    duration: 20,
    status: 'cancelled',
    type: 'Consultation',
    notes: 'Skin condition follow-up'
  },
];

const statusColors = {
  scheduled: 'blue',
  confirmed: 'green',
  completed: 'purple',
  cancelled: 'red'
};

const statusIcons = {
  scheduled: <ClockCircleOutlined />,
  confirmed: <CheckCircleOutlined />,
  completed: <CheckCircleOutlined />,
  cancelled: <CloseCircleOutlined />
};

const Appointments = () => {
  const [filteredData, setFilteredData] = useState(dummyAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, statusFilter, doctorFilter, dateRange);
  };

  const applyFilters = (search, status, doctor, dates) => {
    let result = [...dummyAppointments];
    
    if (search) {
      result = result.filter(appt => 
        appt.patient.name.toLowerCase().includes(search.toLowerCase()) ||
        appt.patient.id.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status !== 'all') {
      result = result.filter(appt => appt.status === status);
    }
    
    if (doctor !== 'all') {
      result = result.filter(appt => appt.doctor.name === doctor);
    }
    
    if (dates && dates.length === 2) {
      result = result.filter(appt => {
        const apptDate = dayjs(appt.date);
        return apptDate.isAfter(dates[0]) && apptDate.isBefore(dates[1]);
      });
    }
    
    setFilteredData(result);
  };

  const handleViewDetails = (record) => {
    setSelectedAppointment(record);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Patient',
      dataIndex: 'patient',
      key: 'patient',
      render: (patient) => (
        <Space>
          <Avatar src={patient.avatar} icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{patient.name}</div>
            <div className="text-gray-500 text-xs">{patient.id}</div>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.patient.name.localeCompare(b.patient.name),
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
      render: (doctor) => (
        <div>
          <div className="font-medium">{doctor.name}</div>
          <div className="text-gray-500 text-xs">{doctor.specialty}</div>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <div>
          <div>{dayjs(date).format('MMM D, YYYY')}</div>
          <div className="text-gray-500">{dayjs(date).format('h:mm A')}</div>
        </div>
      ),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          color={statusColors[status]} 
          text={status.charAt(0).toUpperCase() + status.slice(1)}
          className="flex items-center"
        >
          {statusIcons[status]}
        </Badge>
      ),
      filters: [
        { text: 'Scheduled', value: 'scheduled' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Completed', value: 'completed' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetails(record)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <CalendarOutlined className="mr-2 text-blue-500" />
          Appointments Management
        </h2>
        <Button type="primary" icon={<PlusOutlined />}>
          New Appointment
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <Search
            placeholder="Search patients..."
            allowClear
            enterButton={<SearchOutlined />}
            className="w-full md:w-64"
            onSearch={handleSearch}
          />
          <Select
            placeholder="Filter by status"
            className="w-full md:w-48"
            suffixIcon={<FilterOutlined />}
            onChange={(value) => {
              setStatusFilter(value);
              applyFilters(searchTerm, value, doctorFilter, dateRange);
            }}
          >
            <Option value="all">All Statuses</Option>
            <Option value="scheduled">Scheduled</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
          <Select
            placeholder="Filter by doctor"
            className="w-full md:w-56"
            suffixIcon={<FilterOutlined />}
            onChange={(value) => {
              setDoctorFilter(value);
              applyFilters(searchTerm, statusFilter, value, dateRange);
            }}
          >
            <Option value="all">All Doctors</Option>
            {[...new Set(dummyAppointments.map(a => a.doctor.name))].map(doctor => (
              <Option key={doctor} value={doctor}>{doctor}</Option>
            ))}
          </Select>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="MMM D, YYYY HH:mm"
            className="w-full md:w-72"
            onChange={(dates) => {
              setDateRange(dates);
              applyFilters(searchTerm, statusFilter, doctorFilter, dates);
            }}
          />
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Appointments</p>
              <h3 className="text-2xl font-bold">{filteredData.length}</h3>
            </div>
            <CalendarOutlined className="text-blue-500 text-2xl" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Scheduled</p>
              <h3 className="text-2xl font-bold">
                {filteredData.filter(a => a.status === 'scheduled').length}
              </h3>
            </div>
            <ClockCircleOutlined className="text-blue-500 text-2xl" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Confirmed</p>
              <h3 className="text-2xl font-bold">
                {filteredData.filter(a => a.status === 'confirmed').length}
              </h3>
            </div>
            <CheckCircleOutlined className="text-green-500 text-2xl" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Today's Appointments</p>
              <h3 className="text-2xl font-bold">
                {filteredData.filter(a => dayjs(a.date).isSame(dayjs(), 'day')).length}
              </h3>
            </div>
            <UserOutlined className="text-purple-500 text-2xl" />
          </div>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} appointments`
          }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Appointment Details Modal */}
      <Modal
        title="Appointment Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Patient Information</h3>
                <div className="flex items-start space-x-4">
                  <Avatar size={64} src={selectedAppointment.patient.avatar} icon={<UserOutlined />} />
                  <div>
                    <p className="font-medium text-lg">{selectedAppointment.patient.name}</p>
                    <p className="text-gray-600">ID: {selectedAppointment.patient.id}</p>
                    <p className="text-gray-600">{selectedAppointment.patient.age} years, {selectedAppointment.patient.gender}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Appointment Details</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <Tag color={statusColors[selectedAppointment.status]} className="ml-2">
                      {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                    </Tag>
                  </p>
                  <p><span className="font-medium">Date:</span> {dayjs(selectedAppointment.date).format('MMMM D, YYYY')}</p>
                  <p><span className="font-medium">Time:</span> {dayjs(selectedAppointment.date).format('h:mm A')}</p>
                  <p><span className="font-medium">Duration:</span> {selectedAppointment.duration} minutes</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Medical Information</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Doctor:</span>{' '}
                    <Tag color="blue">{selectedAppointment.doctor.name}</Tag>
                  </p>
                  <p><span className="font-medium">Specialty:</span> {selectedAppointment.doctor.specialty}</p>
                  <p><span className="font-medium">Type:</span> <Tag color="cyan">{selectedAppointment.type}</Tag></p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Notes</h3>
                <div className="bg-gray-50 p-4 rounded">
                  {selectedAppointment.notes || 'No additional notes'}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Appointments;