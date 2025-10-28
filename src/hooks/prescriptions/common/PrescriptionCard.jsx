import React from "react";
import { Card, Tag, Space, Button, Popconfirm, Badge, Typography } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import moment from "moment";

const { Text } = Typography;

const PrescriptionCard = ({ 
  record, 
  onEdit, 
  onDelete, 
  onViewIntervention,
  loading 
}) => {
  const statusColors = {
    dispensed: "green",
    pending: "orange",
    rejected: "red",
    canceled: "gray",
  };

  // Safe access to nested properties
  const clinicalInterventions = record?.clinicalInterventions || [];
  const hasInterventions = clinicalInterventions.length > 0;
  const needsReview = clinicalInterventions.some(
    i => i?.prescriber_response === 'pending'
  );
  const firstIntervention = clinicalInterventions[0];

  return (
    <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 12 }}>
      <div style={{ marginBottom: 8 }}>
        <Text strong>{record?.medicine?.generic_name || 'Unknown Medicine'}</Text>
        {hasInterventions && (
          <Badge 
            count={clinicalInterventions.length} 
            style={{ marginLeft: 8 }} 
            color="red"
          />
        )}
      </div>
      <div style={{ marginBottom: 8 }}>
        <Text>Dosage: {record?.dosage || 'Not specified'}</Text>
      </div>
      <div style={{ marginBottom: 8 }}>
        <Tag color={statusColors[record?.status?.toLowerCase()] || "blue"}>
          {record?.status || 'Unknown'}
        </Tag>
        {needsReview && (
          <Tag color="red" style={{ marginLeft: 4 }}>
            <ExclamationCircleFilled /> Needs Review
          </Tag>
        )}
      </div>
      <div style={{ marginBottom: 8 }}>
        <Text>
          Prescribed by: Dr. {record?.doctor?.lastName || 'Unknown Doctor'}
        </Text>
      </div>
      <div style={{ marginBottom: 8 }}>
        <Text>
          Date: {record?.createdAt 
            ? moment(record.createdAt).format("MMM DD, YYYY") 
            : 'Date not available'
          }
        </Text>
      </div>
      <Space>
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEdit(record)}
        />
        {hasInterventions && (
          <Button
            size="small"
            type="primary"
            danger={needsReview}
            onClick={() => onViewIntervention(firstIntervention)}
          >
            View Flag
          </Button>
        )}
        <Popconfirm
          title="Delete this prescription?"
          onConfirm={() => onDelete(record?.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            loading={loading}
          />
        </Popconfirm>
      </Space>
    </Card>
  );
};

export default PrescriptionCard;