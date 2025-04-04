import React, { useState } from "react";
import { Table, Tag, Typography, Space, Button, Popconfirm, message, Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from 'react-responsive';
import { deletePrescription } from "../redux/slice/prescriptionSlice";

const { Title, Text } = Typography;

// Status color mapping
const statusColors = {
  dispensed: "green",
  pending: "orange",
  rejected: "red",
};

const PrescriptionList = ({ prescriptionData, onDelete }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.prescription);
  const [loadingId, setLoadingId] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await dispatch(deletePrescription(id)).unwrap();
      message.success("Prescription deleted successfully");
      onDelete();
    } catch (error) {
      message.error("Failed to delete prescription");
    } finally {
      setLoadingId(null);
    }
  };

  const handleEdit = (prescription) => {
    console.log("Edit Prescription:", prescription);
  };

  // Mobile view render
  const mobileRender = (record) => (
    <Card 
      style={{ marginBottom: 16 }}
      bodyStyle={{ padding: 12 }}
    >
      <div style={{ marginBottom: 8 }}>
        <Text strong>{record.prescriptions}</Text>
      </div>
      <div style={{ marginBottom: 8 }}>
        <Text>Dosage: {record.dosage}</Text>
      </div>
      <div style={{ marginBottom: 8 }}>
        <Tag color={statusColors[record.status.toLowerCase()] || "blue"}>
          {record.status}
        </Tag>
      </div>
      <div style={{ marginBottom: 8 }}>
        <Text>Prescribed by: Dr. {record.doctor?.lastName}</Text>
      </div>
      <div style={{ marginBottom: 8 }}>
        <Text>Date: {moment(record.createdAt).format("MMM DD, YYYY")}</Text>
      </div>
      <Space>
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        />
        <Popconfirm
          title="Delete this prescription?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            loading={loadingId === record.id}
          />
        </Popconfirm>
      </Space>
    </Card>
  );

  // Desktop columns
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
      render: (status) => (
        <Tag color={statusColors[status.toLowerCase()] || "blue"}>
          {status}
        </Tag>
      ),
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
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this prescription?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              loading={loadingId === record.id}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? 10 : 20 }}>
      <Title level={4} style={{ marginBottom: 16 }}>Prescriptions</Title>
      
      {isMobile ? (
        <div>
          {prescriptionData?.map(record => (
            <div key={record.id}>
              {mobileRender(record)}
            </div>
          ))}
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={prescriptionData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
          bordered 
          loading={status === "loading"}
        />
      )}
    </div>
  );
};

export default PrescriptionList;