import React, { useEffect, useState } from "react";
import { Table, Tag, Input, message, Skeleton, Popconfirm, Tabs } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import BhmsButton from "../../../heroComponents/BhmsButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecordsByInstitution } from "../../../redux/slice/recordSlice";
import { useNavigate } from "react-router-dom";
import BillingStatistics from "./BillingStatistics"; // You'll need to create this component

const { Search } = Input;
const { TabPane } = Tabs;

const InstitutionAccounts = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("patients");
  const dispatch = useDispatch();
  const { records, loading } = useSelector((state) => state.records);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRecordsByInstitution());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchText(value?.toLowerCase() || "");
  };

  const filteredData =
    records?.patients?.filter(
      (record) =>
        record.patient.first_name.toLowerCase().includes(searchText) ||
        record.patient.last_name.toLowerCase().includes(searchText) ||
        record.folder_number.toLowerCase().includes(searchText) ||
        record.serial_number?.toLowerCase().includes(searchText)
    ) || [];

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
        <div className="flex">
          <BhmsButton 
            outline 
            block={false} 
            size="medium" 
            onClick={() => navigate(`/shared/departments/accounts/${record?.patient?.id}/bill-history`)}
          >
            View Bills
          </BhmsButton>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
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
      <Tabs 
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarStyle={{ marginBottom: 24 }}
      >
        <TabPane tab="Patients Bills" key="patients">
          {/* Table Section */}
          {loading ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : (
            <Table 
              dataSource={filteredData} 
              columns={columns} 
              rowKey="id" 
              scroll={{ x: true }}
            />
          )}
        </TabPane>
        
        <TabPane tab="Statistics" key="statistics">
          <BillingStatistics />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default InstitutionAccounts;