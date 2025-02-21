import React from "react";
import { Table, Tag, Typography, Space, Button, Card } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";

const { Title } = Typography;

// Status color mapping
const statusColors = {
  dispensed: "green",
  pending: "orange",
  rejected: "red",
};

const PrescriptionList = ({ prescriptionData }) => {
  const columns = [
    {
      title: "Drug Name",
      dataIndex: "prescriptions",
      key: "prescriptions",
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
      render: (status) => <Tag color={statusColors[status.toLowerCase()] || "blue"}>{status}</Tag>,
    },
    {
      title: "Prescribed By",
      dataIndex: "doctor",
      key: "prescribed_by",
      render: (doctor) => `Dr. ${doctor?.lastName}`,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
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
