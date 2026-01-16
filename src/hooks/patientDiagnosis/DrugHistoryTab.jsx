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
  MedicineBoxOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const DrugHistoryTab = ({ visitId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockData = [
    {
      id: 1,
      drug_name: "Amlodipine",
      dosage: "5mg",
      frequency: "Once daily",
      start_date: "2018-05-20",
      end_date: null,
      indication: "Hypertension",
      status: "current"
    },
    {
      id: 2,
      drug_name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      start_date: "2020-03-25",
      end_date: null,
      indication: "Type 2 Diabetes",
      status: "current"
    }
  ];

  const columns = [
    {
      title: 'Drug Name',
      dataIndex: 'drug_name',
      key: 'drug_name',
      render: (text) => (
        <Text strong style={{ color: '#f5222d' }}>
          {text}
        </Text>
      )
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      key: 'dosage',
      width: 80,
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'current' ? 'blue' : 'default'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Indication',
      dataIndex: 'indication',
      key: 'indication',
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

  const handleView = (record) => {
    Modal.info({
      title: 'Drug History Details',
      content: (
        <div>
          <p><strong>Drug Name:</strong> {record.drug_name}</p>
          <p><strong>Dosage:</strong> {record.dosage}</p>
          <p><strong>Frequency:</strong> {record.frequency}</p>
          <p><strong>Start Date:</strong> {record.start_date}</p>
          <p><strong>End Date:</strong> {record.end_date || 'Ongoing'}</p>
          <p><strong>Indication:</strong> {record.indication}</p>
          <p><strong>Status:</strong> {record.status}</p>
        </div>
      ),
      width: 600,
    });
  };

  const handleAddNew = () => {
    console.log('Add new drug history');
  };

  const handleEdit = (record) => {
    console.log('Edit drug:', record);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Drug History',
      content: 'Are you sure you want to delete this drug history record?',
      onOk: () => {
        console.log('Delete drug:', id);
      }
    });
  };

  return (
    <div>
      <Card
        title={
          <Space>
            <MedicineBoxOutlined />
            <span>Drug History (DH)</span>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
            >
              Add Drug
            </Button>
          </Space>
        }
      >
        {mockData.length === 0 ? (
          <Empty
            description="No drug history recorded"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
              Add First Drug Record
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

export default DrugHistoryTab;