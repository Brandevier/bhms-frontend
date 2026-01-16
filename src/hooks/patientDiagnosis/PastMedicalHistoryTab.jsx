import React, { useState } from 'react';
import {
  Card,
  Button,
  Empty,
  Typography,
  Space,
  Table,
  Tag,
  Tooltip,
  Modal
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const PastMedicalHistoryTab = ({ visitId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockData = [
    {
      id: 1,
      condition: "Hypertension",
      diagnosis_date: "2018-05-15",
      status: "controlled",
      treatment: "Amlodipine 5mg daily",
      notes: "Diagnosed in 2018, well controlled with medication"
    },
    {
      id: 2,
      condition: "Type 2 Diabetes",
      diagnosis_date: "2020-03-20",
      status: "controlled",
      treatment: "Metformin 500mg BD",
      notes: "Diet controlled with occasional medication"
    }
  ];

  const columns = [
    {
      title: 'Medical Condition',
      dataIndex: 'condition',
      key: 'condition',
      render: (text) => (
        <Text strong style={{ color: '#722ed1' }}>
          {text}
        </Text>
      )
    },
    {
      title: 'Diagnosis Date',
      dataIndex: 'diagnosis_date',
      key: 'diagnosis_date',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'controlled' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Treatment',
      dataIndex: 'treatment',
      key: 'treatment',
      width: 150,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleView = (record) => {
    Modal.info({
      title: 'Past Medical History Details',
      content: (
        <div>
          <p><strong>Condition:</strong> {record.condition}</p>
          <p><strong>Diagnosis Date:</strong> {record.diagnosis_date}</p>
          <p><strong>Status:</strong> {record.status}</p>
          <p><strong>Treatment:</strong> {record.treatment}</p>
          <p><strong>Notes:</strong> {record.notes}</p>
        </div>
      ),
      width: 600,
    });
  };

  const handleAddNew = () => {
    // Open modal for adding new PMH
    console.log('Add new PMH');
  };

  const handleEdit = (record) => {
    console.log('Edit record:', record);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Past Medical History',
      content: 'Are you sure you want to delete this medical history record?',
      onOk: () => {
        console.log('Delete record:', id);
      }
    });
  };

  return (
    <div>
      <Card
        title={
          <Space>
            <HistoryOutlined />
            <span>Past Medical History (PMH)</span>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
            >
              Add PMH
            </Button>
          </Space>
        }
      >
        {mockData.length === 0 ? (
          <Empty
            description="No past medical history recorded"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
              Add First PMH Record
            </Button>
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={mockData}
            rowKey="id"
            pagination={false}
            size="small"
          />
        )}
      </Card>
    </div>
  );
};

export default PastMedicalHistoryTab;