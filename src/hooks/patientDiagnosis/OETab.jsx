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
  Modal,
  Descriptions
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined as EyeIcon
} from '@ant-design/icons';

const { Title, Text } = Typography;

const OETab = ({ visitId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockData = [
    {
      id: 1,
      system: "Cardiovascular",
      findings: "Heart rate: 72 bpm, BP: 120/80 mmHg",
      normal: true,
      notes: "Normal cardiovascular examination",
      examiner: "Dr. Smith",
      exam_date: "2024-01-15"
    },
    {
      id: 2,
      system: "Respiratory",
      findings: "Clear breath sounds bilaterally",
      normal: true,
      notes: "No wheezing or crackles noted",
      examiner: "Dr. Smith",
      exam_date: "2024-01-15"
    },
    {
      id: 3,
      system: "Neurological",
      findings: "CN II-XII intact, normal reflexes",
      normal: true,
      notes: "No focal neurological deficits",
      examiner: "Dr. Smith",
      exam_date: "2024-01-15"
    }
  ];

  const columns = [
    {
      title: 'System',
      dataIndex: 'system',
      key: 'system',
      render: (text) => (
        <Text strong style={{ color: '#52c41a' }}>
          {text}
        </Text>
      )
    },
    {
      title: 'Findings',
      dataIndex: 'findings',
      key: 'findings',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'normal',
      key: 'normal',
      width: 100,
      render: (normal) => (
        <Tag color={normal ? 'green' : 'red'}>
          {normal ? 'Normal' : 'Abnormal'}
        </Tag>
      )
    },
    {
      title: 'Examiner',
      dataIndex: 'examiner',
      key: 'examiner',
      width: 120,
    },
    {
      title: 'Date',
      dataIndex: 'exam_date',
      key: 'exam_date',
      width: 100,
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
      title: `On Examination - ${record.system}`,
      content: (
        <Descriptions column={1}>
          <Descriptions.Item label="System">
            <Text strong>{record.system}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Findings">
            {record.findings}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={record.normal ? 'green' : 'red'}>
              {record.normal ? 'Normal' : 'Abnormal'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Notes">
            {record.notes}
          </Descriptions.Item>
          <Descriptions.Item label="Examiner">
            {record.examiner}
          </Descriptions.Item>
          <Descriptions.Item label="Examination Date">
            {record.exam_date}
          </Descriptions.Item>
        </Descriptions>
      ),
      width: 600,
    });
  };

  const handleAddNew = () => {
    console.log('Add new examination findings');
  };

  const handleEdit = (record) => {
    console.log('Edit examination record:', record);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Examination Finding',
      content: 'Are you sure you want to delete this examination record?',
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
            <EyeIcon />
            <span>On Examination (OE)</span>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
            >
              Add Examination
            </Button>
          </Space>
        }
      >
        {mockData.length === 0 ? (
          <Empty
            description="No examination findings recorded"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
              Add First Examination
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

export default OETab;