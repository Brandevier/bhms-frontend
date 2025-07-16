import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Table, Input, message, Button, Card, Statistic,
  Popconfirm, Space, Badge, Select, Modal, Spin, Empty
} from "antd";
import {
  PlusOutlined, FileSearchOutlined, HistoryOutlined,
  LineChartOutlined, SyncOutlined, UserOutlined,
  DeleteOutlined, ExclamationCircleFilled, UserAddOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";

import PatientRegistrationModal from "../../../modal/PatientRegistrationModal";
import BulkPatientRegistrationModal from "../../../modal/BulkPatientRegistrationModal";


import {
  createPatient,
  fetchActiveVisits,
} from "../../../redux/slice/recordSlice"; // renamed slice from visitsSlice to recordSlice

const { Search } = Input;
const { confirm } = Modal;

const Records = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

const patients = useSelector((state) => state.records?.activeVisits ?? []);
const loading = useSelector((state) => state.records?.loading?.activeVisits ?? false);


  const [activeVisits, setActiveVisits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [bulkModalVisible, setBulkModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch active visits from Redux
  useEffect(() => {
    dispatch(fetchActiveVisits())
      .unwrap()
      .then((data) => {
        setActiveVisits(data);
      })
    
  }, [dispatch]);


  // Create new patient
  const handleRegister = (data) => {
    dispatch(createPatient(data))
      .unwrap()
      .then((created) => {
        
        message.success("Patient registered successfully");
        setModalVisible(false);
      })
      .catch(() => {
        message.error("Patient registration failed");
      });
  };

  const showVisitConfirmation = (patientId) => {
    const patient = patients.find(p => p.id === patientId);

    confirm({
      title: 'Confirm New Visit',
      icon: <ExclamationCircleFilled />,
      content: (
        <>
          <p>Initiate new visit for:</p>
          <p className="font-semibold">{patient?.first_name} {patient?.last_name}</p>
          <p className="text-sm text-gray-500">Folder #: {patient?.folder_number}</p>
        </>
      ),
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk() {
        message.success("Visit initiated");
        navigate(`/patient/details/${patientId}`);
      }
    });
  };

  const handleDeletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    message.success("Patient deleted");
  };

  const filteredPatients = patients?.filter(p =>
    (activeTab === 'all' || p.status === activeTab) &&
    (
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.folder_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone_number.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const columns = [
    {
      title: "Patient",
      dataIndex: "first_name",
      render: (_, record) => (
        <div>
          <strong>{record.patient.first_name} {record.patient.middle_name || ''} {record.patient.last_name}</strong><br />
          <span className="text-xs text-gray-500">{record.patient.gender} • {new Date(record.patient.date_of_birth).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      title: "Folder No.",
      dataIndex: "folder_number",
      render:(_,record)=>(
        <>
          <div className="font-semibold">{record.patient.folder_number}</div>
          <div className="text-xs text-gray-500">{record.patient.nhis_number}</div>
        </>
      )
    },
    {
      title: "Visit Type",
      render: (_, record) => ( 
        <>
          <div>{record.visit_type}</div>
          {/* <div className="text-xs text-gray-500">{record.email}</div> */}
        </>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      render: status => (
        <Badge status={status === 'active' ? 'success' : 'default'} text={status} />
      )
    },
{
      title: "Visit Date",
      dataIndex: "visit_date",
      render: status => (
        <span>{moment(status).format('DD MMM YYYY')}</span>
      
      )
    },

    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<FileSearchOutlined />} onClick={() => navigate(`/shared/patient/details/${record.id}`,{id: record.id})}>View</Button>
          <Button size="small" icon={<HistoryOutlined />} onClick={() => showVisitConfirmation(record.id)}>Visit</Button>
          <Popconfirm
            title="Delete this patient?"
            onConfirm={() => handleDeletePatient(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card><Statistic title="Total Patients" value={patients?.length} prefix={<UserOutlined />} /></Card>
        <Card><Statistic title="Active Patients" value={patients?.filter(p => p.status === 'active').length} prefix={<SyncOutlined />} /></Card>
        <Card><Statistic title="Active Visits" value={activeVisits?.length} prefix={<LineChartOutlined />} /></Card>
        <Card><Statistic title="New Today" value={patients?.filter(p => new Date(p.created_at).toDateString() === new Date().toDateString()).length} prefix={<UserAddOutlined />} /></Card>
      </div>

      <Card className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-3 flex-wrap">
            <Search placeholder="Search patients..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: 240 }} enterButton />
            <Select value={activeTab} onChange={setActiveTab} style={{ width: 160 }}>
              <Select.Option value="all">All Patients</Select.Option>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </div>
         <div className="flex">
           <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>Register Patient</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={()=>setBulkModalVisible(true)} className="mx-2">Load Patients</Button>
         </div>
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : filteredPatients?.length === 0 ? (
          <Empty description="No patients found" />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredPatients}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>


      <PatientRegistrationModal
        visible={modalVisible}
        // honCancel={() => setModalVisible(false)}
        onSubmit={handleRegister}
        status={loading}
        onClose={() => setModalVisible(false)}
      />
      <BulkPatientRegistrationModal
        visible={bulkModalVisible}
        onClose={() => setBulkModalVisible(false)}
        status={loading}
        onSubmit={handleRegister}
      />
    </div>
  );
};

export default Records;
