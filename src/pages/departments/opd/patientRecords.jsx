import React, { useEffect, useState } from "react";
import { Table, Tag, Input, message, Tabs, Skeleton, Alert, Popconfirm, Spin } from "antd";
import BhmsButton from "../../../heroComponents/BhmsButton";
import PatientRegistrationModal from "../../../modal/PatientRegistrationModal";
import { useDispatch, useSelector } from "react-redux";
import { createRecord, fetchRecordsByInstitution, deleteRecord } from "../../../redux/slice/recordSlice";
import { useParams, useNavigate } from "react-router-dom";
import { requestConsultation } from "../../../redux/slice/consultationSlice";


const { Search } = Input;
const { TabPane } = Tabs;

const PatientRecordsOPD = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { records, status, error } = useSelector((state) => state.records);
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = useParams(); // Institution ID
  const navigate = useNavigate();
  const { consultationLoading } = useSelector((state) => ({
    consultationLoading: state.consultation?.loading ?? loading
  }));
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10; // Items per page
  const [loadingRow, setLoadingRow] = useState(null);





  useEffect(() => {
    dispatch(fetchRecordsByInstitution({ page, limit }));
  }, [dispatch]);

  // Handle Register New Patient
  const handleRegister = (patientData) => {
    const data = { ...patientData, department_id: id };
    dispatch(createRecord(data))
      .unwrap()
      .then(() => {
        message.success("Patient created successfully");
        dispatch(fetchRecordsByInstitution());
        setModalVisible(false);
      })
      .catch(() => message.error("Failed to create patient"));
  };

  // Handle Search Filtering
  const handleSearch = (value) => {
    setSearchText(value?.toLowerCase() || "");
  };

  // Filter only active records

  // Filter for search text
  const filteredRecords = records?.patients?.filter((record) =>
    record.patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.folder_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.serial_number?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Handle Delete
  const handleDelete = (id) => {
    dispatch(deleteRecord(id))
      .unwrap()
      .then(() => {
        message.success("Record deleted successfully");
        dispatch(fetchRecordsByInstitution());
      })
      .catch(() => message.error("Failed to delete record"));
  };

  // handle request consultation

  const handleConsultation = (record_id) => {
    setLoadingRow(record_id); // Set the loading row

    dispatch(requestConsultation(record_id))
      .unwrap()
      .then(() => {
        message.success("Consultation requested successfully");
        dispatch(fetchRecordsByInstitution());
        navigate(`/shared/patient/details/${record_id}`);
      })
      .catch(() => message.error("Failed to request consultation"))
      .finally(() => {
        setLoadingRow(null); // Reset loading state after completion
      });
  };



  // Table Columns
  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) =>
        `${record?.patient?.first_name || ""} ${record?.patient?.middle_name || ""} ${record?.patient?.last_name || ""}`,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (_, record) => record?.patient?.gender || "N/A",
    },
    {
      title: "NIN Number",
      dataIndex: "nin_number",
      key: "nin_number",
    },
    {
      title: "Folder Number",
      dataIndex: "folder_number",
      key: "folder_number",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color="green">{status?.toUpperCase()}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <BhmsButton block={false} size="medium" outline onClick={() => navigate(`/shared/patient/details/${record?.id}`)}>
            View
          </BhmsButton>
          <span className="mx-2"></span>
          <BhmsButton
            disabled={loadingRow === record?.id}
            block={false}
            size="medium"
            onClick={() => handleConsultation(record?.id)}
          >
            {loadingRow === record?.id ? <Spin /> : "Request Consultation"}
          </BhmsButton>

        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {error && <Alert message="Error" description={error.message} type="error" showIcon closable />}

      {/* Top Bar: Search & Register */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <Search
          placeholder="Search Name, Folder Number, NIN"
          value={searchText}
          onChange={(e) => handleSearch(e?.target?.value)}
          style={{ width: 300 }}
          allowClear
        />
        {/* <BhmsButton block={false} icon={<PlusOutlined />} size="medium" onClick={() => setModalVisible(true)}>
          Register New Patient
        </BhmsButton> */}
      </div>

      {/* Tabs Section */}
      <Tabs defaultActiveKey="all">
        {/* All Active Patients */}
        <TabPane tab={`All`} key="all">
          {status === "loading" ? <Skeleton active paragraph={{ rows: 5 }} /> : <Table dataSource={filteredRecords} columns={columns} rowKey="id" />}
        </TabPane>

        {/* Retake Vitals Request (Placeholder, Modify logic as needed) */}

      </Tabs>

      {/* Patient Registration Modal */}
      <PatientRegistrationModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleRegister} status={status} />
    </div>
  );
};

export default PatientRecordsOPD;
