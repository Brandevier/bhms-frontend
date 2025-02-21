import React, { useEffect, useState } from "react";
import { Table, Tag, Input, message, Tabs, Skeleton, Alert, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BhmsButton from "../../../heroComponents/BhmsButton";
import PatientRegistrationModal from "../../../modal/PatientRegistrationModal";
import { useDispatch, useSelector } from "react-redux";
import { createRecord, fetchRecordsByInstitution, deleteRecord } from "../../../redux/slice/recordSlice";
import { useParams, useNavigate } from "react-router-dom";

const { Search } = Input;
const { TabPane } = Tabs;

const Records = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { records, status, error } = useSelector((state) => state.records);
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = useParams(); // Institution ID
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRecordsByInstitution());
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

  const filteredData = records?.filter(
    (item) =>
      item?.patient?.first_name?.toLowerCase()?.includes(searchText) ||
      item?.patient?.last_name?.toLowerCase()?.includes(searchText) ||
      item?.folder_number?.includes(searchText) ||
      item?.nin_number?.includes(searchText)
  );

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
      render: (status) => {
        let color = status === "active" ? "green" : status === "discharged" ? "red" : "blue";
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <BhmsButton block={false} size="medium" icon={<EditOutlined />} outline onClick={() => navigate(`/shared/patient/details/${record?.id}`)}>
            View
          </BhmsButton>
          <span className="mx-2"></span>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record?.id)}>
            <BhmsButton block={false} size="medium" icon={<DeleteOutlined />} color="red">
              Delete
            </BhmsButton>
          </Popconfirm>
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
        <BhmsButton block={false} icon={<PlusOutlined />} size="medium" onClick={() => setModalVisible(true)}>
          Register New Patient
        </BhmsButton>
      </div>

      {/* Tabs Section */}
      <Tabs defaultActiveKey="patients">
        {/* Active Patients */}
        <TabPane tab={`Patients (${records?.length || 0})`} key="patients">
          {status === "loading" ? <Skeleton active paragraph={{ rows: 5 }} /> : <Table dataSource={filteredData} columns={columns} rowKey="id" />}
        </TabPane>

        {/* Discharged Patients */}
        <TabPane
          tab={`Discharged Patients (${records?.filter((r) => r?.status === "discharged")?.length || 0})`}
          key="discharged"
        >
          {status === "loading" ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : (
            <Table dataSource={records?.filter((r) => r?.status === "discharged")} columns={columns} rowKey="id" />
          )}
        </TabPane>

        {/* Transferred Patients */}
        <TabPane
          tab={`Transferred Patients (${records?.filter((r) => r?.status === "transferred")?.length || 0})`}
          key="transferred"
        >
          {status === "loading" ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : (
            <Table dataSource={records?.filter((r) => r?.status === "transferred")} columns={columns} rowKey="id" />
          )}
        </TabPane>

        {/* Incoming Appointments */}
        <TabPane tab={`Incoming Appointments (${0})`} key="appointments">
          <Skeleton active paragraph={{ rows: 5 }} />
        </TabPane>
      </Tabs>

      {/* Patient Registration Modal */}
      <PatientRegistrationModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleRegister} status={status} />
    </div>
  );
};

export default Records;