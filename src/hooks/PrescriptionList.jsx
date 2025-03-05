import React, { useState } from "react";
import { Table, Tag, Typography, Space, Button, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { deletePrescription } from "../redux/slice/prescriptionSlice";

const { Title } = Typography;

// Status color mapping
const statusColors = {
  dispensed: "green",
  pending: "orange",
  rejected: "red",
};

const PrescriptionList = ({ prescriptionData,onDelete }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.prescription);
  
  const [loadingId, setLoadingId] = useState(null); // Store ID of prescription being deleted

  // Handle Delete Prescription
  const handleDelete = async (id) => {
    setLoadingId(id); // Set loading state for the specific row
    try {
      await dispatch(deletePrescription(id)).unwrap();
      message.success("Prescription deleted successfully");
      onDelete()
    } catch (error) {
      message.error("Failed to delete prescription");
    } finally {
      setLoadingId(null); // Reset loading state
    }
  };

  // Handle Edit Prescription (Placeholder)
  const handleEdit = (prescription) => {
    console.log("Edit Prescription:", prescription);
    // Open Edit Form or Modal
  };

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
          {/* Edit Button */}
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />

          {/* Delete Button with Popconfirm */}
          <Popconfirm
            title="Are you sure you want to delete this prescription?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              loading={loadingId === record.id} // Show loading only for the clicked row
            />
          </Popconfirm>
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
