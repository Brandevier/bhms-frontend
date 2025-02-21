import React, { useEffect, useState } from "react";
import { Table, Tag, Input, message, Tabs, Skeleton, Alert, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BhmsButton from "../../../heroComponents/BhmsButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecordsByInstitution, deleteRecord } from "../../../redux/slice/recordSlice";
import { useParams, useNavigate } from "react-router-dom";

const { Search } = Input;
const { TabPane } = Tabs;

const ConsultationDepartment = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { records, status, error } = useSelector((state) => state.records);
  const { id } = useParams(); // Institution ID
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

      {/* Top Bar: Search */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <Search
          placeholder="Search Name, Folder Number, NIN"
          value={searchText}
          onChange={(e) => handleSearch(e?.target?.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      {/* Tabs Section */}
      <Tabs defaultActiveKey="opd">
        {/* Patients from OPD */}
        <TabPane tab={`Patients from OPD (${activeRecords?.length || 0})`} key="opd">
          {status === "loading" ? <Skeleton active paragraph={{ rows: 5 }} /> : <Table dataSource={filteredData} columns={columns} rowKey="id" />}
        </TabPane>

        {/* Statistics - Placeholder */}
        <TabPane tab="Statistics" key="statistics">
          <p>Statistics will be displayed here.</p>
        </TabPane>

        {/* Request Items - Placeholder */}
        <TabPane tab="Request Items" key="request-items">
          <p>Request items section.</p>
        </TabPane>

        {/* Shift - Placeholder */}
        <TabPane tab="Shift" key="shift">
          <p>Shift details will be displayed here.</p>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ConsultationDepartment;
