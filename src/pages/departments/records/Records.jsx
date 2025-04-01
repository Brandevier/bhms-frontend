import React, { useEffect, useState } from "react";
import { Table, Tag, Input, message, Skeleton, Alert, Popconfirm, Button } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BhmsButton from "../../../heroComponents/BhmsButton";
import PatientRegistrationModal from "../../../modal/PatientRegistrationModal";
import { useDispatch, useSelector } from "react-redux";
import { createRecord, fetchRecordsByInstitution, deleteRecord } from "../../../redux/slice/recordSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const { Search } = Input;

const Records = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { records, loading, totalPages, status } = useSelector((state) => state.records);
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const { consultationLoading } = useSelector((state) => ({
    consultationLoading: state.consultation?.loading ?? loading
  }));

  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(fetchRecordsByInstitution({ page, limit }));
  }, [dispatch]);

  const handleRegister = (patientData) => {
    const data = { ...patientData, department_id: id };
    dispatch(createRecord({recordData:data}))
      .unwrap()
      .then(() => {
        message.success("Patient created successfully");
        dispatch(fetchRecordsByInstitution());
        setModalVisible(false);
      })
      .catch(() => message.error("Failed to create patient"));
  };

  const handleSearch = (value) => {
    setSearchText(value?.toLowerCase() || "");
  };

  const filteredData = records?.patients?.filter((record) =>
    record.patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.folder_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.serial_number?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = (id) => {
    dispatch(deleteRecord(id))
      .unwrap()
      .then(() => {
        message.success("Record deleted successfully");
        dispatch(fetchRecordsByInstitution());
      })
      .catch(() => message.error("Failed to delete record"));
  };

  // Responsive columns configuration
  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) =>
        `${record?.patient?.first_name || ""} ${record?.patient?.middle_name || ""} ${record?.patient?.last_name || ""}`,
      fixed: isMobile ? 'left' : false,
      width: isMobile ? 150 : undefined,
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
      fixed: isMobile ? 'right' : false,
      width: isMobile ? 150 : undefined,
      render: (_, record) => (
        <div className='flex'>
          <BhmsButton 
            outline 
            block={false} 
            size={isMobile ? 'small' : 'medium'} 
            onClick={() => navigate(`/shared/patient/details/${record?.id}`)}
          >
            {isMobile ? 'View' : 'View Details'}
          </BhmsButton>
          <Popconfirm 
            title="Are you sure to delete this record?" 
            onConfirm={() => handleDelete(record?.id)}
            okText="Yes"
            cancelText="No"
          >
            <BhmsButton 
              block={false} 
              size={isMobile ? 'small' : 'medium'} 
              icon={<DeleteOutlined />} 
              color="red" 
              className="mx-2"
            >
              {isMobile ? '' : 'Delete'}
            </BhmsButton>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? "10px" : "20px" }}>
      {/* Top Bar: Search & Register */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        marginBottom: "15px",
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '10px' : 0
      }}>
        <Search
          placeholder="Search Name, Folder Number, NIN"
          value={searchText}
          onChange={(e) => handleSearch(e?.target?.value)}
          style={{ width: isMobile ? '100%' : 300 }}
          allowClear
          size={isMobile ? 'large' : 'middle'}
        />
        
        {isMobile ? (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setModalVisible(true)}
            style={{ alignSelf: 'flex-end' }}
            size="large"
          />
        ) : (
          <BhmsButton 
            block={false} 
            icon={<PlusOutlined />} 
            size="medium" 
            onClick={() => setModalVisible(true)}
          >
            Register New Patient
          </BhmsButton>
        )}
      </div>

      {/* Table Section */}
      {status === "loading" ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <div style={{ 
          width: '100%', 
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          <Table 
            dataSource={filteredData} 
            columns={columns} 
            rowKey="id"
            scroll={{ x: isMobile ? 800 : undefined }}
            size={isMobile ? 'small' : 'middle'}
            style={{
              minWidth: isMobile ? '800px' : '100%'
            }}
          />
        </div>
      )}

      {/* Patient Registration Modal */}
      <PatientRegistrationModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onSubmit={handleRegister} 
        status={status} 
      />
    </div>
  );
};

export default Records;