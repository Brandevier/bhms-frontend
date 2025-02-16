import React from "react";
import { Card, Table, Empty, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import BhmsAvatar from "../heroComponents/BhmsAvatar";


const PatientBills = ({ bills }) => {
  // Dummy Data if No Bills are Provided
  const dummyBills = [
    { key: "1", service: "Routine Check-Up", amount: "$50" },
    { key: "2", service: "Blood Test", amount: "$30" },
    { key: "3", service: "X-Ray", amount: "$80" },
    { key: "4", service: "MRI Scan", amount: "$200" }
  ];

  // Use provided bills or fallback to dummy data
  const dataSource = bills && bills.length > 0 ? bills : dummyBills;
  // Table Columns
  const columns = [
    { title: "Service", dataIndex: "service", key: "service" },
    { title: "Amount", dataIndex: "amount", key: "amount" }
  ];

  return (
    <Card
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Bills</span>
          <Tooltip title="Add Nurse's Note">
            <BhmsAvatar
              outline
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            />
          </Tooltip>
        </div>
      }

      bordered={true} style={{ marginTop: 20 }} >
      {dataSource.length > 0 ? (
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      ) : (
        <Empty description="No Bills Available" />
      )}
    </Card>
  );
};

export default PatientBills;
