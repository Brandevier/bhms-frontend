import React from "react";
import { Table, Tag, Card } from "antd";

const shiftColors = {
  Morning: "blue",
  Afternoon: "gold",
  Night: "purple",
  Off: "red",
};

const columns = [
  {
    title: "Staff Name",
    dataIndex: "name",
    key: "name",
    fixed: "left",
  },
  ...["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => ({
    title: day,
    dataIndex: day.toLowerCase(),
    key: day.toLowerCase(),
    render: (shift) => <Tag color={shiftColors[shift]}>{shift}</Tag>,
  })),
];

const data = [
  {
    key: "1",
    name: "Dr. James Carter",
    monday: "Morning",
    tuesday: "Afternoon",
    wednesday: "Night",
    thursday: "Off",
    friday: "Morning",
    saturday: "Afternoon",
    sunday: "Off",
  },
  {
    key: "2",
    name: "Nurse Linda Smith",
    monday: "Afternoon",
    tuesday: "Night",
    wednesday: "Off",
    thursday: "Morning",
    friday: "Afternoon",
    saturday: "Night",
    sunday: "Morning",
  },
  {
    key: "3",
    name: "Dr. Robert Brown",
    monday: "Night",
    tuesday: "Off",
    wednesday: "Morning",
    thursday: "Afternoon",
    friday: "Night",
    saturday: "Off",
    sunday: "Afternoon",
  },
];

const HMSStaffShiftSchedule = () => {
  return (
    <Card title="HMS Staff Shift Schedule" bordered style={{ borderRadius: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.1)", overflow: "auto" }}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default HMSStaffShiftSchedule;
