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
  EyeInvisibleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const OccupationalHistoryTab = ({ visitId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockData = [
    {
      id: 1,
      occupation: "Software Engineer",
      employer: "Tech Corp Inc.",
      duration: "5 years",
      exposure: "Computer work, sedentary lifestyle",
      hazards: "Eye strain, repetitive stress",
      current: true
    },
    {
      id: 2,
      occupation: "Construction Worker",
      employer: "Builders Ltd.",
      duration: "3 years",
      exposure: "Dust, heavy lifting",
      hazards: "Back injuries, respiratory issues",
      current: false
    }
  ];

  const columns = [
    {
      title: 'Occupation',
      dataIndex: 'occupation',
      key: 'occupation',
      render: (text) => (
        <Text strong style={{ color: '#fa8c16' }}>
          {text}
        </Text>
      )
    },
    {
      title: 'Employer',
      dataIndex: 'employer',
      key: 'employer',
      width: 150,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'current',
      key: 'current',
      width: 80,
      render: (current) => (
        <Tag color={current ? 'green' : 'default'}>
          {current ? 'Current' : 'Past'}
        </Tag>
      )
    },
    {
      title: 'Exposure',
      dataIndex: 'exposure',
      key: 'exposure',
      width: 150,
      ellipsis: true,
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
      title: 'Occupational History Details',
      content: (
        <div>
          <p><strong>Occupation:</strong> {record.occupation}</p>
          <p><strong>Employer:</strong> {record.employer}</p>
          <p><strong>Duration:</strong> {record.duration}</p>
          <p><strong>Status:</strong> {record.current ? 'Current' : 'Past'}</p>
          <p><strong>Exposure:</strong> {record.exposure}</p>
          <p><strong>Hazards:</strong> {record.hazards}</p>
        </div>
      ),
      width: 600,
    });
  };

  const handleAddNew = () => {
    console.log('Add new occupational history');
  };

  const handleEdit = (record) => {
    console.log('Edit occupational record:', record);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Occupational History',
      content: 'Are you sure you want to delete this occupational history record?',
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
            <EyeInvisibleOutlined />
            <span>Occupational History (ODQ)</span>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
            >
              Add Occupation
            </Button>
          </Space>
        }
      >
        {mockData.length === 0 ? (
          <Empty
            description="No occupational history recorded"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
              Add First Occupation
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

export default OccupationalHistoryTab;