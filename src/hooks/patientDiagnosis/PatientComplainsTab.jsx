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
  MessageOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const PatientComplainsTab = ({ visitId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Mock data for now - replace with actual API calls
  const mockData = [
    {
      id: 1,
      complaint: "Headache for 3 days",
      duration: "3 days",
      severity: "Moderate",
      onset: "Gradual",
      associated_symptoms: "Nausea, photophobia",
      created_at: "2024-01-15",
      status: "active"
    },
    {
      id: 2,
      complaint: "Fever and cough",
      duration: "2 days",
      severity: "Mild",
      onset: "Acute",
      associated_symptoms: "Body aches, fatigue",
      created_at: "2024-01-14",
      status: "resolved"
    }
  ];

  const columns = [
    {
      title: 'Complaint',
      dataIndex: 'complaint',
      key: 'complaint',
      render: (text) => (
        <Text strong style={{ color: '#1890ff' }}>
          {text}
        </Text>
      )
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 120,
      render: (severity) => {
        let color = 'default';
        if (severity === 'Mild') color = 'green';
        if (severity === 'Moderate') color = 'orange';
        if (severity === 'Severe') color = 'red';
        return <Tag color={color}>{severity}</Tag>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'blue' : 'green'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
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

  const handleAddNew = () => {
    setSelectedRecord(null);
    setModalVisible(true);
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    // Show view modal or expand details
    Modal.info({
      title: 'Patient Complaint Details',
      content: (
        <div>
          <p><strong>Complaint:</strong> {record.complaint}</p>
          <p><strong>Duration:</strong> {record.duration}</p>
          <p><strong>Severity:</strong> {record.severity}</p>
          <p><strong>Onset:</strong> {record.onset}</p>
          <p><strong>Associated Symptoms:</strong> {record.associated_symptoms}</p>
          <p><strong>Status:</strong> {record.status}</p>
          <p><strong>Date Recorded:</strong> {record.created_at}</p>
        </div>
      ),
      width: 600,
    });
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Patient Complaint',
      content: 'Are you sure you want to delete this patient complaint?',
      onOk: () => {
        // Handle delete API call
        console.log('Delete record:', id);
      }
    });
  };

  return (
    <div>
      <Card
        title={
          <Space>
            <MessageOutlined />
            <span>Patient Complaints</span>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
            >
              Add Complaint
            </Button>
          </Space>
        }
      >
        {mockData.length === 0 ? (
          <Empty
            description="No patient complaints recorded"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
              Add First Complaint
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

      {/* Add/Edit Modal - To be implemented */}
    </div>
  );
};

export default PatientComplainsTab;