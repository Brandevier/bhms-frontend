import React from "react";
import { Table, Tag, Typography, Space, Button, Card } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";

const { Title } = Typography;

// Sample prescription data (Replace with actual API data)
const prescriptions = [
  {
    id: "1",
    drug: "Amoxicillin 500mg",
    dosage: "1 capsule every 8 hours",
    status: "Dispensed",
    prescribedBy: "Dr. John Doe",
    date: "2025-02-16",
  },
  {
    id: "2",
    drug: "Paracetamol 500mg",
    dosage: "2 tablets every 6 hours",
    status: "Pending",
    prescribedBy: "Dr. Jane Smith",
    date: "2025-02-15",
  },
  {
    id: "3",
    drug: "Ibuprofen 200mg",
    dosage: "1 tablet every 8 hours",
    status: "Rejected",
    prescribedBy: "Dr. Michael Brown",
    date: "2025-02-14",
  },
];

// Status color mapping
const statusColors = {
  Dispensed: "green",
  Pending: "orange",
  Rejected: "red",
};

const PrescriptionList = ({ prescriptionData = prescriptions }) => {
  const columns = [
    {
      title: "Drug Name",
      dataIndex: "drug",
      key: "drug",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Dosage",
      dataIndex: "dosage",
      key: "dosage",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status] || "blue"}>{status}</Tag>,
    },
    {
      title: "Prescribed By",
      dataIndex: "prescribedBy",
      key: "prescribedBy",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("MMM DD, YYYY"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => console.log("View", record)}>
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={4}>Prescriptions</Title>
      
      <Table
        columns={columns}
        dataSource={prescriptionData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default PrescriptionList;
