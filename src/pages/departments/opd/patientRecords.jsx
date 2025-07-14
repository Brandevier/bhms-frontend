import React, { useEffect, useState } from "react";
import { 
  Table, 
  Input, 
  message, 
  Modal, 
  Tag, 
  Card, 
  Spin,
  Popconfirm,
  Space,
  Badge
} from "antd";
import { 
  FileSearchOutlined, 
  MedicineBoxOutlined,
  ExclamationCircleFilled 
} from "@ant-design/icons";
import BhmsButton from "../../../heroComponents/BhmsButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchActiveVisits } from "../../../redux/slice/recordSlice";

const { Search } = Input;
const { confirm } = Modal;

const PatientRecordsOPD = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { activeVisits, loading, error } = useSelector((state) => state.records);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [consultationLoading, setConsultationLoading] = useState(null);

  useEffect(() => {
    dispatch(fetchActiveVisits());
  }, [dispatch]);

  const showConsultationConfirmation = (patientId) => {
    const patient = activeVisits.find(v => v.patient.id === patientId)?.patient;
    
    confirm({
      title: 'Confirm Consultation Request',
      icon: <ExclamationCircleFilled />,
      content: (
        <div>
          <p>Request consultation for:</p>
          <p className="font-semibold">{patient?.first_name} {patient?.last_name}</p>
          <p className="text-sm text-gray-500">Folder #: {patient?.folder_number}</p>
        </div>
      ),
      okText: 'Confirm Request',
      cancelText: 'Cancel',
      onOk() {
        return handleConsultationRequest(patientId);
      }
    });
  };

  const handleConsultationRequest = async (patientId) => {
    setConsultationLoading(patientId);
    try {
      // Replace with actual consultation request action
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      message.success("Consultation requested successfully");
      navigate(`/opd/patient/${patientId}`);
    } catch (err) {
      message.error("Failed to request consultation");
    } finally {
      setConsultationLoading(null);
    }
  };

  const filteredVisits = activeVisits.filter(visit => {
    const patient = visit.patient || {};
    return (
      patient.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.folder_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const columns = [
    {
      title: 'Patient',
      dataIndex: ['patient', 'first_name'],
      key: 'patient',
      render: (_, record) => (
        <div className="flex items-center">
          <div className="ml-2">
            <div className="font-medium">
              {record.patient.first_name} {record.patient.last_name}
            </div>
            <div className="text-xs text-gray-500">
              {record.patient.gender} • {record.patient.date_of_birth}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Folder Number',
      dataIndex: ['patient', 'folder_number'],
      key: 'folder_number',
      render: (text) => <span className="font-mono">{text}</span>,
    },
    {
      title: 'Visit Date',
      dataIndex: 'visit_date',
      key: 'visit_date',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status="processing" 
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <BhmsButton
            block={false}
            size="medium"
            outline
            icon={<FileSearchOutlined />}
            onClick={() => navigate(`/opd/patient/${record.patient.id}`)}
          >
            Details
          </BhmsButton>
          <BhmsButton
            block={false}
            size="medium"
            type="primary"
            icon={<MedicineBoxOutlined />}
            onClick={() => showConsultationConfirmation(record.patient.id)}
            loading={consultationLoading === record.patient.id}
          >
            Request Consultation
          </BhmsButton>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      {error && (
        <Alert 
          message="Error" 
          description={error} 
          type="error" 
          showIcon 
          className="mb-4"
          closable 
        />
      )}

      <Card className="mb-4">
        <div className="flex justify-between items-center">
          <Search
            placeholder="Search patients..."
            allowClear
            enterButton
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <div className="text-sm text-gray-500">
            Showing {filteredVisits.length} active visits
          </div>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredVisits}
          rowKey={(record) => record.id}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false
          }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default PatientRecordsOPD;