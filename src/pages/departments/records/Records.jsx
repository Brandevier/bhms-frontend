import React, { useEffect, useState } from "react";
import { 
  Table, 
  Tag, 
  Input, 
  message, 
  Skeleton, 
  Button, 
  Card, 
  Statistic,
  Popconfirm,
  Space,
  Badge,
  Divider,
  Select,
  
} from "antd";
import { 
  PlusOutlined, 
  FileSearchOutlined, 
  UserAddOutlined,
  HistoryOutlined,
  LineChartOutlined,
  FilterOutlined,
  SyncOutlined,
  UserOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { 
  createRecord, 
  fetchRecordsByInstitution, 
  deleteRecord,
  
} from "../../../redux/slice/recordSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import PatientRegistrationModal from "../../../modal/PatientRegistrationModal";
// 




const { Search } = Input;

// Dummy data for demonstration
const dummyPatients = [
  {
    id: '1',
    patient: {
      first_name: 'Kwame',
      middle_name: 'Osei',
      last_name: 'Amponsah',
      gender: 'male',
      dob: '1985-04-12',
      phone: '+233244556677',
      address: '12 Ashanti St, Kumasi'
    },
    folder_number: 'F-2023-001',
    serial_number: 'SN-001',
    nin_number: 'GHA-123456789',
    status: 'active',
    last_visit: '2023-06-15',
    visit_count: 4
  },
  {
    id: '2',
    patient: {
      first_name: 'Ama',
      middle_name: 'Serwaa',
      last_name: 'Mensah',
      gender: 'female',
      dob: '1992-11-25',
      phone: '+233277889900',
      address: '34 Coastal Rd, Accra'
    },
    folder_number: 'F-2023-002',
    serial_number: 'SN-002',
    nin_number: 'GHA-987654321',
    status: 'active',
    last_visit: '2023-06-18',
    visit_count: 2
  },
  {
    id: '3',
    patient: {
      first_name: 'Yaw',
      middle_name: '',
      last_name: 'Boateng',
      gender: 'male',
      dob: '1978-07-30',
      phone: '+233200112233',
      address: '56 Northern Ave, Tamale'
    },
    folder_number: 'F-2023-003',
    serial_number: 'SN-003',
    nin_number: 'GHA-456789123',
    status: 'inactive',
    last_visit: '2023-05-10',
    visit_count: 1
  },
  {
    id: '4',
    patient: {
      first_name: 'Esi',
      middle_name: 'Ama',
      last_name: 'Nyarko',
      gender: 'female',
      dob: '1995-02-14',
      phone: '+233255667788',
      address: '78 Volta Lane, Ho'
    },
    folder_number: 'F-2023-004',
    serial_number: 'SN-004',
    nin_number: 'GHA-789123456',
    status: 'active',
    last_visit: '2023-06-20',
    visit_count: 3
  }
];

const Records = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  // Redux state
  const { records, loading, status } = useSelector((state) => state.records);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [visitModalVisible, setVisitModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  const limit = 10;

  useEffect(() => {
    dispatch(fetchRecordsByInstitution({ page, limit }));
  }, [dispatch, page, limit]);

  const handleRegister = (patientData) => {
    const data = { ...patientData, department_id: id };
    dispatch(createRecord({ recordData: data }))
      .unwrap()
      .then(() => {
        message.success("Patient created successfully");
        dispatch(fetchRecordsByInstitution({ page, limit }));
        setModalVisible(false);
      })
      .catch(() => message.error("Failed to create patient"));
  };

  const handleInitiateVisit = (patientId) => {
    // setSelectedPatient(patientId);
    // setVisitModalVisible(true);
  };

  const confirmVisitInitiation = (visitData) => {
    dispatch(initiatePatientVisit({ patientId: selectedPatient, ...visitData }))
      .unwrap()
      .then(() => {
        message.success("Patient visit initiated successfully");
        dispatch(fetchRecordsByInstitution({ page, limit }));
        setVisitModalVisible(false);
      })
      .catch(() => message.error("Failed to initiate visit"));
  };

  const handleDelete = (id) => {
    dispatch(deleteRecord(id))
      .unwrap()
      .then(() => {
        message.success("Record deleted successfully");
        dispatch(fetchRecordsByInstitution({ page, limit }));
      })
      .catch(() => message.error("Failed to delete record"));
  };

  // For demo purposes, we'll combine dummy data with actual data
  const dataSource = [...(records?.patients || []), ...dummyPatients];
  
  const filteredData = dataSource.filter(patient =>
    `${patient.patient?.first_name || ''} ${patient.patient?.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.folder_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.nin_number?.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(patient => 
    activeTab === 'all' ? true : patient.status === activeTab
  );

  const columns = [
    {
      title: "Patient",
      dataIndex: "patient",
      key: "patient",
      fixed: isMobile ? 'left' : false,
      width: isMobile ? 180 : 200,
      render: (patient) => (
        <div className="flex items-center">
          <div className="ml-2">
            <div className="font-medium">{`${patient?.first_name || ''} ${patient?.last_name || ''}`}</div>
            <div className="text-xs text-gray-500">{patient?.gender} • {patient?.dob}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Folder No.",
      dataIndex: "folder_number",
      key: "folder_number",
      width: 120,
      render: (text) => <span className="font-mono">{text}</span>,
    },
    {
      title: "NIN",
      dataIndex: "nin_number",
      key: "nin_number",
      width: 150,
      render: (text) => <span className="font-mono">{text || 'N/A'}</span>,
    },
    {
      title: "Last Visit",
      dataIndex: "last_visit",
      key: "last_visit",
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString() : 'Never',
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'default'} 
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: isMobile ? 'right' : false,
      width: isMobile ? 150 : 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            size="small"
            icon={<FileSearchOutlined />}
            onClick={() => navigate(`/shared/patient/details/${record.id}`)}
          >
            {isMobile ? '' : 'View'}
          </Button>
          <Button 
            type="primary" 
            size="small"
            icon={<HistoryOutlined />}
            onClick={() => handleInitiateVisit(record.id)}
          >
            {isMobile ? '' : 'Initiate'}
          </Button>
          <Popconfirm
            title="Delete this patient record?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              size="small"
              icon={<DeleteOutlined />}
            >
              {isMobile ? '' : 'Delete'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <Statistic 
            title="Total Patients" 
            value={dataSource.length} 
            prefix={<UserOutlined />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Active Patients" 
            value={dataSource.filter(p => p.status === 'active').length} 
            prefix={<SyncOutlined />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Avg Visits" 
            value={(dataSource.reduce((sum, p) => sum + (p.visit_count || 0), 0) / dataSource.length).toFixed(1)} 
            prefix={<LineChartOutlined />}
          />
        </Card>
        <Card>
          <Statistic 
            title="New Today" 
            value={dataSource.filter(p => p.last_visit === new Date().toISOString().split('T')[0]).length} 
            prefix={<UserAddOutlined />}
          />
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Search
              placeholder="Search patients..."
              allowClear
              enterButton
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
            
            <Select
              value={activeTab}
              onChange={setActiveTab}
              size="large"
              className="w-full md:w-48"
            >
              <Select.Option value="all">All Patients</Select.Option>
              <Select.Option value="active">Active Only</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </div>
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setModalVisible(true)}
          >
            {isMobile ? 'New Patient' : 'Register New Patient'}
          </Button>
        </div>
      </Card>

      {/* Patients Table */}
      <Card loading={loading}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: true }}
          pagination={{
            pageSize: limit,
            current: page,
            total: filteredData.length,
            onChange: (page) => setPage(page),
            showSizeChanger: false
          }}
        />
      </Card>

      {/* Modals */}
      <PatientRegistrationModal 
        visible={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        onSubmit={handleRegister} 
        loading={status === 'loading'} 
      />
{/*       
      <VisitInitiationModal
        visible={visitModalVisible}
        onCancel={() => setVisitModalVisible(false)}
        onSubmit={confirmVisitInitiation}
        patient={selectedPatient ? dataSource.find(p => p.id === selectedPatient) : null}
      /> */}
    </div>
  );
};

export default Records;