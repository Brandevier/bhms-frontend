import React, { useEffect, useState } from "react";
import { Table, Tag, Input, message, Skeleton, Alert } from "antd";
import { EditOutlined } from "@ant-design/icons";
import BhmsButton from "../../../heroComponents/BhmsButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecordsByInstitution, deleteRecord } from "../../../redux/slice/recordSlice";
import { useParams, useNavigate } from "react-router-dom";

const { Search } = Input;

const ConsultationDepartment = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { records, status, error } = useSelector((state) => state.records);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRecordsByInstitution());
  }, [dispatch]);

  // Handle Search Filtering
  const handleSearch = (value) => {
    setSearchText(value?.toLowerCase() || "");
  };

  // Filter only active OPD patients
  const activeRecords = records?.filter((record) => record.status === "active" && record.visit_type === "outpatient");

  // Filter for search text
  const filteredData = activeRecords?.filter(
    (item) =>
      item?.patient?.first_name?.toLowerCase()?.includes(searchText) ||
      item?.patient?.last_name?.toLowerCase()?.includes(searchText) ||
      item?.folder_number?.includes(searchText) ||
      item?.nin_number?.includes(searchText)
  );

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
      render: () => <Tag color="green">ACTIVE</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <BhmsButton block={false} size="medium" icon={<EditOutlined />} outline onClick={() => navigate(`/shared/patient/details/${record?.id}`)}>
            View
          </BhmsButton>
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {error && <Alert message="Error" description={error.message} type="error" showIcon closable />}

      {/* Search Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <Search
          placeholder="Search Name, Folder Number, NIN"
          value={searchText}
          onChange={(e) => handleSearch(e?.target?.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      {/* Table */}
      {status === "loading" ? <Skeleton active paragraph={{ rows: 5 }} /> : <Table dataSource={filteredData} columns={columns} rowKey="id" />}
    </div>
  );
};

export default ConsultationDepartment;
