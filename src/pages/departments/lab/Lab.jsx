import React, { useState } from "react";
import { Table, Input, Segmented, Tag, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import RequestLabComponent from "./RequestLabComponent";
import InProgressComponent from "./InProgressComponent";
import CompleteLabComponent from "./CompleteLabComponent";
import LabStatistics from "./LabStatistics";




const Lab = () => {
  const [selectedTab, setSelectedTab] = useState("Request");



  return (
    <div style={{ padding: 20 }}>
      <Segmented
        options={[
          "Request",
          "In Progress",
          "Completed",
          "Overview",
          "Staff on Duty",
        ]}
        value={selectedTab}
        onChange={setSelectedTab}
        style={{ marginBottom: 20 }}
      />

      {/* Render components based on the selected tab */}
      {selectedTab === "Request" && (
        <>
          <RequestLabComponent/>
        </>
      )}

      {selectedTab === "In Progress" && (
        <>
         <InProgressComponent/>
        </>
      )}

      {selectedTab === "Completed" && (
        <>
        <CompleteLabComponent/>
        </>
      )}

      {selectedTab === "Overview" && (
        <>
        <LabStatistics/>
        </>
      )}

      {selectedTab === "Staff on Duty" && (
        <>
          {/* StaffOnDutyComponent should be placed here */}
        </>
      )}

      {/* <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} /> */}
    </div>
  );
};

export default Lab;
