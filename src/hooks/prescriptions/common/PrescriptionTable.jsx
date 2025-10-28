import React from "react";
import { Table, Tag, Space, Button, Popconfirm, Badge, Card, Typography } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, MedicineBoxOutlined } from "@ant-design/icons";
import moment from "moment";

const { Text } = Typography;

const PrescriptionTable = ({ 
  data, 
  loading, 
  onEdit, 
  onDelete, 
  onViewIntervention,
  loadingId 
}) => {
  const statusColors = {
    dispensed: "green",
    pending: "orange",
    rejected: "red",
    canceled: "gray",
  };

  const frequencyLabels = {
    once: "Once daily",
    twice: "Twice daily",
    three_times: "Three times daily",
    four_times: "Four times daily",
    every_four_hours: "Every 4 hours",
    every_six_hours: "Every 6 hours",
    every_eight_hours: "Every 8 hours",
    every_twelve_hours: "Every 12 hours",
    as_needed: "As needed",
    bedtime: "At bedtime"
  };

  const handleEditClick = (record) => {
    if (record.is_dispensed || record.status?.toLowerCase() === "dispensed") {
      message.warning("Cannot edit a dispensed prescription");
      return;
    }
    onEdit(record);
  };

  const handleDeleteClick = (recordId, status, isDispensed) => {
    if (isDispensed || status?.toLowerCase() === "dispensed") {
      message.warning("Cannot delete a dispensed prescription");
      return false;
    }
    return true;
  };

  const columns = [
    {
      title: "Medication",
      dataIndex: "medicine",
      key: "medicine",
      width: 200,
      render: (medicine, record) => {
        const interventions = record?.clinicalInterventions || [];
        const hasInterventions = interventions.length > 0;
        
        return (
          <Space direction="vertical" size={2}>
            <div className="flex items-center gap-2">
              <MedicineBoxOutlined className="text-blue-500" />
              <Text strong className="text-sm">
                {medicine?.generic_name || 'Unknown Medication'}
              </Text>
            </div>
            {medicine?.strength && (
              <Text type="secondary" className="text-xs">
                Strength: {medicine.strength}
              </Text>
            )}
            {hasInterventions && (
              <Badge count={`${interventions.length} Flag${interventions.length > 1 ? 's' : ''}`} color="red" />
            )}
          </Space>
        );
      },
    },
    {
      title: "Prescription Details",
      key: "prescription_details",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <div>
            <Text strong>Dose: </Text>
            <Text>{record.dosage || 'N/A'}</Text>
          </div>
          <div>
            <Text strong>Frequency: </Text>
            <Text>{frequencyLabels[record.frequency] || record.frequency || 'N/A'}</Text>
          </div>
          <div>
            <Text strong>Duration: </Text>
            <Text>{record.duration ? `${record.duration} days` : 'N/A'}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Status & Info",
      key: "status_info",
      render: (_, record) => {
        const interventions = record?.clinicalInterventions || [];
        const needsReview = interventions.some(i => i?.prescriber_response === 'pending');
        const isDispensed = record.is_dispensed || record.status?.toLowerCase() === "dispensed";
        const statusText = record.status || 'pending';
        
        return (
          <Space direction="vertical" size={4}>
            <Tag 
              color={statusColors[statusText.toLowerCase()] || "blue"}
              className="m-0"
            >
              {statusText.toUpperCase()}
            </Tag>
            
            {isDispensed && record.quantity && (
              <div className="text-center">
                <Text strong className="text-green-600 text-sm">
                  Qty: {record.quantity}
                </Text>
              </div>
            )}
            
            {needsReview && (
              <Tag color="red" icon={<ExclamationCircleFilled />}>
                Needs Review
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: "Prescriber & Date",
      key: "prescriber_date",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <div>
            <Text strong>By: </Text>
            <Text>Dr. {record.doctor?.lastName || 'Unknown'}</Text>
          </div>
          <div>
            <Text strong>Date: </Text>
            <Text type="secondary">
              {record.createdAt && moment(record.createdAt).isValid() 
                ? moment(record.createdAt).format("MMM DD, YYYY")
                : 'N/A'
              }
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
      render: (_, record) => {
        const interventions = record?.clinicalInterventions || [];
        const hasInterventions = interventions.length > 0;
        const needsReview = interventions.some(i => i?.prescriber_response === 'pending');
        const firstIntervention = interventions[0];
        const isDispensed = record.is_dispensed || record.status?.toLowerCase() === "dispensed";
        
        return (
          <Space direction="vertical" size={4}>
            {hasInterventions && (
              <Button
                size="small"
                type="primary"
                danger={needsReview}
                onClick={() => onViewIntervention(firstIntervention)}
                block
              >
                View Flag
              </Button>
            )}
            
            <Space size={2}>
              <Button
                size="small"
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditClick(record)}
                disabled={isDispensed}
                title={isDispensed ? "Cannot edit dispensed prescription" : "Edit prescription"}
              />
              <Popconfirm
                title="Delete this prescription?"
                description="This action cannot be undone."
                onConfirm={() => {
                  if (handleDeleteClick(record?.id, record.status, isDispensed)) {
                    onDelete(record?.id);
                  }
                }}
                okText="Yes"
                cancelText="No"
                disabled={isDispensed}
              >
                <Button
                  size="small"
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  loading={loadingId === record?.id}
                  disabled={isDispensed}
                  title={isDispensed ? "Cannot delete dispensed prescription" : "Delete prescription"}
                />
              </Popconfirm>
            </Space>
          </Space>
        );
      },
    },
  ];

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <MedicineBoxOutlined className="text-blue-500" />
          <span>Medication Prescriptions</span>
          <Badge 
            count={data?.length || 0} 
            showZero 
            color="blue" 
            className="ml-2"
          />
        </div>
      }
      className="shadow-sm"
    >
      <Table
        columns={columns}
        dataSource={data || []}
        rowKey="id"
        pagination={{ 
          pageSize: 5, 
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} prescriptions`
        }}
        scroll={{ x: 800 }}
        loading={loading}
        size="middle"
        rowClassName={(record) => 
          (record.is_dispensed || record.status?.toLowerCase() === "dispensed") 
            ? "bg-green-50" 
            : ""
        }
      />
    </Card>
  );
};

export default PrescriptionTable;