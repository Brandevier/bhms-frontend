import React, { useState } from "react";
import { Table, Input, Tabs } from "antd";
import BhmsButton from "../../../heroComponents/BhmsButton";
const { Search } = Input;

const patientData = [
  { key: "1", fullName: "John Doe", gender: "Male", nin: "123456789", folderNumber: "A001", status: "Confirmed" },
  { key: "2", fullName: "Jane Smith", gender: "Female", nin: "987654321", folderNumber: "A002", status: "Pending" },
  { key: "3", fullName: "Michael Johnson", gender: "Male", nin: "456123789", folderNumber: "A003", status: "Cancelled" },
];

const PatientRecords = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Count patients by status
  const totalPatients = patientData.length;
  const confirmedCount = patientData.filter((p) => p.status === "Confirmed").length;
  const pendingCount = patientData.filter((p) => p.status === "Pending").length;
  const cancelledCount = patientData.filter((p) => p.status === "Cancelled").length;

  // Filter data based on selected tab
  const filteredData = patientData.filter((patient) => {
    if (activeTab === "Confirmed") return patient.status === "Confirmed";
    if (activeTab === "Pending") return patient.status === "Pending";
    if (activeTab === "Cancelled") return patient.status === "Cancelled";
    return true; // Show all patients
  });

  const columns = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "NIN Number", dataIndex: "nin", key: "nin" },
    { title: "Folder Number", dataIndex: "folderNumber", key: "folderNumber" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => <BhmsButton block={false} size="medium" outline={true} type="link">View</BhmsButton>,
    },
  ];

  // Tab Styling
  const tabStyle = (key) => ({
    padding: "5px 10px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s",
    background: activeTab === key ? "#1E293B" : "#F1F5F9", // Dark blue for active, light for others
    color: activeTab === key ? "#fff" : "#000",
    marginRight: "10px",
  });

  return (
    <div style={{ padding: "10px" }}>
      {/* Custom Tabs */}
      <div style={{ display: "flex", marginBottom: "16px", background: "#F8FAFC", padding: "5px", borderRadius: "5px" }}>
        <div style={tabStyle("all")} onClick={() => setActiveTab("all")}>
          All ({totalPatients})
        </div>
        <div style={tabStyle("Confirmed")} onClick={() => setActiveTab("Confirmed")}>
          Confirmed ({confirmedCount})
        </div>
        <div style={tabStyle("Pending")} onClick={() => setActiveTab("Pending")}>
          Pending ({pendingCount})
        </div>
        <div style={tabStyle("Cancelled")} onClick={() => setActiveTab("Cancelled")}>
          Cancelled ({cancelledCount})
        </div>
      </div>

      {/* Search Input */}
      <Search
        placeholder="Search by Name, NIN, Folder Number"
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />

      {/* Patient Table */}
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default PatientRecords;
